import express from 'express';
//to handle errors thrown from async function
import 'express-async-errors';
import { json } from 'body-parser';
import {errorHandler} from "./middlewares/error-handler";
import cookieSession from 'cookie-session';
import {NotFoundError} from "./errors/not-found-error";
import {indexTicketRouter} from "./routes";
import {showTicketRouter} from "./routes/show";
import {currentUser} from "./middlewares/current-user";
import {createTicketRouter} from "./routes/new";
import {updateTicketRouter} from "./routes/update";
import {produceMessage} from "./kafka/producer";
import {runConsumer} from "./kafka/consumer";
import './grpc/server';
import {client} from "./grpc/client";
import {YourTopicProducer} from "./events/producers/your-topic-procucer";
import {kafkaWrapper} from "./events/kafka-wrapper";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
);

app.use(currentUser);
// runConsumer().catch(console.error);
app.get('/api/tickets/produce', async (req, res) => {
    const message = 'Hello Kafka!';
    const topic = 'your_topic'; // Replace with the desired topic
    // const result = await produceMessage(topic, message);
    const result = await new YourTopicProducer(kafkaWrapper.producer).publish({text: 'Hello from new producer'});
    res.send(`Produced message: ${message}, Offset: ${result.offset}`);
});

// app.get('/api/tickets/grpc', async (req, res) => {
//     client.createTodo({
//         id: -1,
//         text: "todo"
//     }, (err: any, response: any) => {
//         console.log("Recieved from server " + JSON.stringify(response))
//     });
//
//     res.send();
// });

app.use(indexTicketRouter);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(updateTicketRouter);

app.get('*', (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };