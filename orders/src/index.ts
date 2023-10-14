import mongoose from 'mongoose';
import { app } from "./app";
import {kafkaWrapper} from "./events/kafka-wrapper"
import {topics} from "./events/topics";

const start = async () => {
    try {
        await mongoose.connect('mongodb://orders-mongo-srv:27017/orders');
    } catch (err) {
        console.error(err);
    }

    app.listen(3000,async () => {
        console.log('Listening on port 3000!!');
        await initKafka()
    });
};

async function initKafka ()
{
    kafkaWrapper.init('my-kafka-app',['kafka-srv:9092']);
    await kafkaWrapper.connectProducer();
    await kafkaWrapper.connectConsumer(topics);
}
start();
