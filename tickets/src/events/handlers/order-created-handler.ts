import {EventDataMap, Subjects} from "../types";
import {BaseEventHandler} from "./base-event-handler";
import {Ticket, TicketDoc} from "../../models/ticket";
import {kafkaWrapper} from "../kafka-wrapper";
import {TicketUpdatedProducer} from "../producers/ticket-updated-producer";

export class OrderCreatedHandler extends BaseEventHandler<Subjects.OrderCreated> {
    async handle(data: EventDataMap[Subjects.OrderCreated]): Promise<void> {

        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({ orderId: data.id });

        await ticket.save();


        await new TicketUpdatedProducer(kafkaWrapper.producer).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId,
        });

    }
}