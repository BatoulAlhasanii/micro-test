import {EventDataMap, Subjects} from "../types";
import {Producer, RecordMetadata} from "kafkajs";

export abstract class BaseEventProducer<T extends keyof EventDataMap> {
    abstract subject: T;
    constructor(protected producer: Producer) {}

    async publish(data: EventDataMap[T]):Promise<RecordMetadata> {
        console.log(this.subject, data);
        const result:RecordMetadata[] = await this.producer.send({
            topic: this.subject,
            messages: [{ value: JSON.stringify(data) }],
        });

        return result[0];
    }
}