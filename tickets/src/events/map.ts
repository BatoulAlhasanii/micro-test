import {Subjects, EventHandlerMap} from "./types";
import {YourTopicHandler} from "./handlers/your-topic-handler";
import {TicketCreatedHandler} from "./handlers/ticket-created-handler";


export const eventHandlerMap= {
    [Subjects.TicketCreated]: TicketCreatedHandler,

    [Subjects.YourTopic]: YourTopicHandler,
}