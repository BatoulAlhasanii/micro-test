import {Subjects} from "./types";
import {BaseEventHandler} from "./handlers/base-event-handler";
import {OrderCreatedHandler} from "./handlers/order-created-handler";
import {OrderCancelledHandler} from "./handlers/order-cancelled-handler";

export const eventHandlerMap:  Partial<Record<Subjects, new () => BaseEventHandler<Subjects>>> = {
    [Subjects.OrderCreated]: OrderCreatedHandler,
    [Subjects.OrderCancelled]: OrderCancelledHandler,
}