import mongoose from 'mongoose';
import { app } from "./app";
import {kafkaWrapper} from "./events/kafka-wrapper"
import {topics} from "./events/topics";

const start = async () => {
    try {
        kafkaWrapper.init('my-kafka-app',['kafka-srv:9092']);
        await kafkaWrapper.connectProducer();
        await kafkaWrapper.connectConsumer(topics);

        await mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets');
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!!');
    });
};

start();
