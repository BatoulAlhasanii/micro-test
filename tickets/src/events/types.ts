import {YourTopicHandler} from "./handlers/your-topic-handler";
import {TicketCreatedHandler} from "./handlers/ticket-created-handler";
import {OrderStatus} from "../types/order-status";

export enum Subjects {
    YourTopic = 'YourTopic',
    TicketCreated = 'TicketCreated',
    TicketUpdated = 'TicketUpdated',
    OrderCreated = 'OrderCreated',
    OrderCancelled = 'OrderCancelled',
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
    };
    [Subjects.OrderCancelled]: {
        id: string;
        version: number;
        ticket: {
            id: number,
        }
    };
    [Subjects.OrderCreated]: {
        id: string,
        version: number,
        status: OrderStatus,
        userId: string,
        expiresAt: string,
        ticket: {
            id: string,
            price: number
        }
    };
}
