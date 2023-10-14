import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {requireAuth} from "../middlewares/require-auth";
import {Ticket} from "../models/ticket";
import {NotFoundError} from "../errors/not-found-error";
import {NotAuthorizedError} from "../errors/not-authorized-error";
import {BadRequestError} from "../errors/bad-request-error";
import {validateRequest} from "../middlewares/validate-request";
import {TicketUpdatedProducer} from "../events/producers/ticket-updated-producer";
import {kafkaWrapper} from "../events/kafka-wrapper";
import {currentUser} from "../middlewares/current-user";


const router = express.Router();

router.put(
    '/api/tickets/:id',
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { title, price } = req.body;

        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.orderId) {
            throw new BadRequestError('Cannot edit a reserved ticket');
        }

        if (ticket.userId != req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        ticket.set({
            title,
            price,
        });

        await ticket.save();

        new TicketUpdatedProducer(kafkaWrapper.producer).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
        });

        res.send(ticket);
    }
);

export { router as updateTicketRouter };
