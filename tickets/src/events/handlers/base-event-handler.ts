import {EventDataMap, Subjects} from "../types";

export abstract class BaseEventHandler<T extends Subjects> {
     abstract handle(data: EventDataMap[T]): void;
}