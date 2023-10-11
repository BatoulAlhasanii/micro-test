import { BadRequestError } from "./errors/bad-request-error";
import {Kafka, Consumer, EachMessagePayload, Partitioners, Producer, BrokersFunction} from 'kafkajs';

class KafkaWrapper {
    protected _kafka: Kafka;
    protected _producer: Producer;
    protected _consumer: Consumer;

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

    public async connectConsumer(topics: string[], eventHandlerMap: Record<Subjects, BaseEventHandler<Subjects>>) {
        if (!this._kafka) {
            throw new Error('Kafka is not configured');
        }

        this._consumer = this._kafka.consumer({groupId: 'my-consumer-group'});
        await this._consumer.connect();
        await this._consumer.subscribe({topics: ['your_topic'], fromBeginning: true});
    }

    subscribe(consumer: Consumer) {
        consumer.run({
            eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                console.log(`Received message on topic ${topic}, partition ${partition}: ${message.value}`);
                const parsedData = this.parseMessage(message.value);
                const handler = classRegistry[parsedData.subject];

                if (handler) {
                    await handler(parsedData); // Call the corresponding handler function
                } else {
                    console.warn(`No handler found for topic: ${topic}`);
                }
            },
        });
    }

    private parseMessage(msg) {
        const data = msg.getData();
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    }
}