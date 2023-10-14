import {YourTopicHandler} from "./handlers/your-topic-handler";
import {TicketCreatedHandler} from "./handlers/ticket-created-handler";

export enum Subjects {
    YourTopic = 'YourTopic',
    TicketCreated = 'TicketCreated',
    TicketUpdated = 'TicketUpdated',
}

export type EventType = Subjects.YourTopic | Subjects.TicketCreated;

export interface EventDataMap {
    [Subjects.YourTopic]: { text: string };
    [Subjects.TicketCreated]: {
        id: string;
        version: number;
        title: string;
        price: number;
        userId: string;
    };
    [Subjects.TicketUpdated]: {
        id: string;
        version: number;
        title: string;
        price: number;
        userId: string;
        orderId?: string;
    }
}
