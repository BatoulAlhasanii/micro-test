import {BaseEventHandler} from "./base-event-handler";
import {Subjects, EventDataMap} from "../types";

export class TicketCreatedHandler extends BaseEventHandler<Subjects.TicketCreated> {
    handle(data: EventDataMap[Subjects.TicketCreated]): void {

    }
}