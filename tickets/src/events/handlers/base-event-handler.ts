import {EventDataMap, Subjects} from "../types";

export abstract class BaseEventHandler<T extends keyof EventDataMap> {
     abstract handle(data: EventDataMap[T]): void | Promise<void>;
}