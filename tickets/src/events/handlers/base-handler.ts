import {EventDataMap} from "../types";

export interface BaseEventHandler<T extends Subjects> {
    handle(data: EventDataMap[T]);
}