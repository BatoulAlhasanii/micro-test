import express, {Request, Response} from "express";
import {requireAuth} from "../middlewares/require-auth";
import {body} from "express-validator";
import mongoose from "mongoose";
import {Ticket, TicketDoc} from "../models/ticket";
import {NotFoundError} from "../errors/not-found-error";
import {BadRequestError} from "../errors/bad-request-error";
import {Order} from "../models/order";
import {OrderStatus} from "../types/order-status";
import {OrderCreatedProducer} from "../events/producers/order-created-producer";
import {kafkaWrapper} from "../events/kafka-wrapper";
import {validateRequest} from "../middlewares/validate-request";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS: number = 1 * 60;
router.post(
    '/api/orders',
    requireAuth,
    [
        body('ticketId')
            .notEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('TicketId must be provided'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError();
        }

        const isReserved: boolean = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError('Ticket is already reserved');
        }

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket: ticket as TicketDoc
        });
        await order.save();

        new OrderCreatedProducer(kafkaWrapper.producer).publish({
            id: order.id,
            version: order.version,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        });

        res.status(201).send(order);
    }
);

export { router as createOrderRouter };