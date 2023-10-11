import {Kafka, Consumer, EachMessagePayload, Partitioners, Producer, BrokersFunction, ValueOf} from 'kafkajs';
import {eventHandlerMap} from './map';
import {Subjects} from "./types";
import {BaseEventHandler} from "./handlers/base-event-handler";

class KafkaWrapper {
    protected _kafka?: Kafka;
    protected _producer?: Producer;
    protected _consumer?: Consumer;

    get producer() {
        if (!this._producer) {
            throw new Error('Cannot access Kafka producer before connecting');
        }

        return this._producer;
    }
    get consumer() {
        if (!this._consumer) {
            throw new Error('Cannot access Kafka consumer before connecting');
        }

        return this._consumer;
    }

    public init(clientId: string, brokers: string[] | BrokersFunction) {
        this._kafka = new Kafka({ clientId, brokers });
    }

    public async connectProducer() {
        if (!this._kafka) {
            throw new Error('Kafka is not configured');
        }

        this._producer = this._kafka.producer();
        await this._producer.connect();
    }

    public async connectConsumer(topics: string[]) {
        if (!this._kafka) {
            throw new Error('Kafka is not configured');
        }

        this._consumer = this._kafka.consumer({groupId: 'my-consumer-group'});
        await this._consumer.connect();
        await this._consumer.subscribe({topics, fromBeginning: true});
        this.subscribe()
    }

    private subscribe() {
        this._consumer!.run({
            eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                const parsedData = this.parseMessage(message.value);

                const subjectKey: Subjects = Subjects[topic as unknown as Subjects];
                const classHandler: new () => BaseEventHandler<Subjects> = eventHandlerMap[subjectKey];

                if (classHandler) {
                    const handler: BaseEventHandler<Subjects> = new classHandler();
                    handler.handle(parsedData);
                } else {
                    console.warn(`No handler found for topic: ${topic}`);
                }
            },
        });
    }

    private parseMessage(data: any) {
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    }
}

export const kafkaWrapper: KafkaWrapper = new KafkaWrapper();