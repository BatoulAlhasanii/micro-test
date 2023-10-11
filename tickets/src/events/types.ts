import {BaseEventHandler} from "./handlers/base-handler";

export enum Subjects {
    YourTopic = 'your_topic',
    TicketCreated = 'ticket:created',
    TicketUpdated = 'ticket:updated',
}

export interface EventDataMap {
    [Subjects.YourTopic]: string;
    [Subjects.TicketCreated]: {
        id: string;
        version: number;
        title: string;
        price: number;
        userId: string;
    };
    [Subjects.TicketUpdated]: string;
}

export interface EventHandlerMap {
    [Subjects.YourTopic]: BaseEventHandler<Subjects.YourTopic>;
    [Subjects.TicketCreated]: BaseEventHandler<Subjects.TicketCreated>;
}
