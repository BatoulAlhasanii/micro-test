import {BaseEventProducer} from "./base-event-producer";
import {Subjects} from "../types";

export class TicketCreatedProducer extends BaseEventProducer<Subjects.TicketCreated>
{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}