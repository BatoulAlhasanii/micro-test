import {BaseEventProducer} from "./base-event-producer";
import {Subjects} from "../types";

export class OrderCancelledProducer extends BaseEventProducer<Subjects.OrderCancelled> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}