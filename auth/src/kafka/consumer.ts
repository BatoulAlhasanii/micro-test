import { Kafka, Consumer, EachMessagePayload, Partitioners } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'my-kafka-app',
    brokers: ['kafka-srv:9092'],
});

const consumer = kafka.consumer({ groupId: 'my-consumer-group' });

const topic = 'your_topic'; // Replace with the desired topic

export const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
            console.log(`Received message on topic ${topic}, partition ${partition}: ${message.value}`);
        },
    });
};

