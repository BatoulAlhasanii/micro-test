import {BaseEventHandler} from "./base-event-handler";
import {EventDataMap, Subjects} from "../types";
import {Ticket} from "../../models/ticket";

export class TicketUpdatedHandler extends BaseEventHandler<Subjects.TicketUpdated> {
    async handle(data: EventDataMap[Subjects.TicketUpdated]): Promise<void> {
        const {id, version, title, price} = data;

        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({
            title,
            price,
        });

        await ticket.save();
    }

}