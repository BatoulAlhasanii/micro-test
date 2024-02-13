import {OrderStatus} from "../types/order-status";

export enum Subjects {
    TicketCreated = 'TicketCreated',
    TicketUpdated = 'TicketUpdated',
    OrderCreated = 'OrderCreated',
    OrderCancelled = 'OrderCancelled',
}

export interface EventDataMap {
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
            id: number;
        }
    };
    [Subjects.OrderCreated]: {
        id: string;
        version: number;
        status: OrderStatus;
        userId: string;
        expiresAt: string;
        ticket: {
            id: string;
            price: number;
        };
    };
}
