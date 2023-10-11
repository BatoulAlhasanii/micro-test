import {BaseEventHandler} from "./base-handler";
import {Subjects, EventDataMap} from "../types";

export class TicketCreatedHandler implements BaseEventHandler<Subjects.TicketCreated> {
    async handle(data: EventDataMap[Subjects.TicketCreated]) {

    }
}