import {EventDataMap, Subjects} from "../types";
import {BaseEventHandler} from "./base-event-handler";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedProducer} from "../producers/ticket-updated-producer";
import {kafkaWrapper} from "../kafka-wrapper";

export class OrderCancelledHandler extends BaseEventHandler<Subjects.OrderCancelled> {
    async handle(data: EventDataMap[Subjects.OrderCancelled]): Promise<void> {
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({ orderId: undefined });

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