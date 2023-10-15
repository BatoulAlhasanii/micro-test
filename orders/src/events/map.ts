import {EventDataMap, Subjects} from "./types";
import {BaseEventHandler} from "./handlers/base-event-handler";
import {TicketUpdatedHandler} from "./handlers/ticket-updated-handler";
import {TicketCreatedHandler} from "./handlers/ticket-created-handler";


export const eventHandlerMap:  Partial<Record<Subjects, new () => BaseEventHandler<keyof EventDataMap>>> = {
    [Subjects.TicketCreated]: TicketCreatedHandler,
    [Subjects.TicketUpdated]: TicketUpdatedHandler,
}