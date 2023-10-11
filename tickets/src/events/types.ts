import {YourTopicHandler} from "./handlers/your-topic-handler";
import {TicketCreatedHandler} from "./handlers/ticket-created-handler";

export enum Subjects {
    YourTopic = 'your_topic',
    TicketCreated = 'ticket:created',
}

export interface EventDataMap {
    [Subjects.YourTopic]: { text: string };
    [Subjects.TicketCreated]: {
        id: string;
        version: number;
        title: string;
        price: number;
        userId: string;
    };
}

export interface EventHandlerMap {
    [Subjects.YourTopic]: YourTopicHandler;
    [Subjects.TicketCreated]: TicketCreatedHandler;
}
