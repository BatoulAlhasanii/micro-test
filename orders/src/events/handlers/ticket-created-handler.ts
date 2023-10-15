import {BaseEventHandler} from "./base-event-handler";
import {Subjects, EventDataMap} from "../types";
import {Ticket} from "../../models/ticket";

export class TicketCreatedHandler extends BaseEventHandler<Subjects.TicketCreated> {
    async handle(data: EventDataMap[Subjects.TicketCreated]): Promise<void> {
        const { id, title, price } = data;

        const ticket = Ticket.build({
            id,
            title,
            price,
        });

        await ticket.save();

        //send ack
    }
}