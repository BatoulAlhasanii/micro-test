import { Kafka, Producer, RecordMetadata, Partitioners } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'my-kafka-app',
    brokers: ['kafka-srv:9092'],
});

const producer = kafka.producer();

producer.connect();

export const produceMessage = async (topic: string, message: string): Promise<RecordMetadata> => {
    const result = await producer.send({
        topic,
        messages: [{ value: message }],
    });

    console.log("helooooooo from producer");
    return result[0];
};