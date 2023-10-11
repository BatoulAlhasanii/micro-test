import { BadRequestError } from "../errors/bad-request-error";
import {Kafka, Consumer, EachMessagePayload, Partitioners, Producer, BrokersFunction, ValueOf} from 'kafkajs';
import {eventHandlerMap} from './map';
import {EventDataMap, EventHandlerMap, Subjects} from "./types";
import {Expression} from "mongoose";
import {BaseEventHandler} from "./handlers/base-event-handler";
import {YourTopicHandler} from "./handlers/your-topic-handler";
import {TicketCreatedHandler} from "./handlers/ticket-created-handler";

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
        await this._consumer.subscribe({topics: ['your_topic'], fromBeginning: true});
        this.subscribe()
    }

    private subscribe() {
        this._consumer!.run({
            eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                console.log("Heloooooo from consumer")

                console.log(`Received message on topic ${topic}, partition ${partition}: ${message.value}`);
                const parsedData = this.parseMessage(message.value);

                let handler;
                switch (topic) {
                    case Subjects.YourTopic:
                        handler = new YourTopicHandler();
                        break;
                    case Subjects.TicketCreated:
                        handler = new TicketCreatedHandler();
                        break;
                }

                if (handler) {
                    await handler.handle(parsedData); // Call the corresponding handler function
                } else {
                    console.warn(`No handler found for topic: ${topic}`);
                }

                // const indexOfS: number = Object.values(Subjects).indexOf(topic as unknown as Subjects);
                //
                // const subjectKey = Object.keys(Subjects)[indexOfS];
                // console.log(subjectKey);
                //
                // // const subjectKey: Subjects | undefined = Subjects[topic as keyof typeof Subjects];
                //
                // const handler = eventHandlerMap[subjectKey];
                // console.log("Heloo from new consumer",
                //     eventHandlerMap[Subjects.YourTopic],
                //     Object.keys(parsedData),
                //     topic);
                //
                // if (handler) {
                //     await new handler().handle(parsedData); // Call the corresponding handler function
                // } else {
                //     console.warn(`No handler found for topic: ${topic}`);
                // }
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