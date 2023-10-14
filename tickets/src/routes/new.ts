import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {validateRequest} from "../middlewares/validate-request";
import {Ticket} from "../models/ticket";
import {requireAuth} from "../middlewares/require-auth";
import {kafkaWrapper} from "../events/kafka-wrapper";
import {TicketCreatedProducer} from "../events/producers/ticket-created-producer";

const router = express.Router();


router.post(
    '/api/tickets',
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id
        });

        await ticket.save();

        //I didn't add await because we don't have to let the user wait for the event to be published
        new TicketCreatedProducer(kafkaWrapper.producer).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
        });

        res.status(201).send(ticket);
    }
)

export { router as createTicketRouter };