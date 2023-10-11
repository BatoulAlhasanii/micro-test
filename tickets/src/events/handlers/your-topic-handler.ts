import {BaseEventHandler} from "./base-handler";
import {Subjects, EventDataMap} from "../types";

export class YourTopicHandler implements BaseEventHandler<Subjects.YourTopic> {
    async handle(data: EventDataMap[Subjects.YourTopic]) {

    }
}