import {BaseEventProducer} from "./base-event-producer";
import {Subjects} from "../types";

export class TicketUpdatedProducer extends BaseEventProducer<Subjects.TicketUpdated> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}