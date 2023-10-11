import {BaseEventProducer} from "./base-event-producer";
import {Subjects} from "../types";

export class YourTopicProducer extends BaseEventProducer<Subjects.YourTopic>
{
    subject: Subjects.YourTopic = Subjects.YourTopic;
}