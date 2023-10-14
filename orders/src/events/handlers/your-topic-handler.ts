import {BaseEventHandler} from "./base-event-handler";
import {Subjects, EventDataMap} from "../types";

export class YourTopicHandler extends BaseEventHandler<Subjects.YourTopic> {
    async handle(data: EventDataMap[Subjects.YourTopic]): Promise<void>{
        console.log("Handling YourTopic event");
    }
}