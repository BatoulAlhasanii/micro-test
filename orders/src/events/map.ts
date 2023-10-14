import {Subjects} from "./types";
import {YourTopicHandler} from "./handlers/your-topic-handler";
import {TicketCreatedHandler} from "./handlers/ticket-created-handler";
import {BaseEventHandler} from "./handlers/base-event-handler";


export const eventHandlerMap:  Partial<Record<Subjects, new () => BaseEventHandler<Subjects>>> = {
    [Subjects.TicketCreated]: TicketCreatedHandler,
    [Subjects.YourTopic]: YourTopicHandler,
}