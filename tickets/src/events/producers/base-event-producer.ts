import {EventDataMap, Subjects} from "../types";
import {Producer, RecordMetadata} from "kafkajs";

export abstract class BaseEventProducer<T extends Subjects> {
    abstract subject: T;
    constructor(protected producer: Producer) {}

    async publish(data: EventDataMap[T]):Promise<RecordMetadata> {
        const result:RecordMetadata[] = await this.producer.send({
            topic: this.subject,
            messages: [{ value: JSON.stringify(data) }],
        });

        return result[0];
    }
}