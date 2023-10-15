import {BaseEventProducer} from "./base-event-producer";
import {Subjects} from "../types";

export class OrderCreatedProducer extends BaseEventProducer<Subjects.OrderCreated> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}