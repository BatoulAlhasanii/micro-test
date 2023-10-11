import express from 'express';
//to handle errors thrown from async function
import 'express-async-errors';
import { json } from 'body-parser';
import {errorHandler} from "./middlewares/error-handler";
import cookieSession from 'cookie-session';
import {NotFoundError} from "./errors/not-found-error";

import { currentUserRouter } from "./routes/current-user";
import {signInRouter} from "./routes/sign-in";
import {signOutRouter} from "./routes/sign-out";
import {signUpRouter} from "./routes/sign-up";
import {runConsumer} from "./kafka/consumer";
import {client, TodoItem} from "./grpc/client";
import {MongoMemoryServer} from "mongodb-memory-server";


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
);

runConsumer().catch(console.error);

app.get('/api/users/grpc', async (req, res) => {
    // client.createTodo({
    //     id: -1,
    //     text: "todo"
    // }, (err: any, response: any) => {
    //     console.log("Recieved from server " + JSON.stringify(response))
    // });

    // client.readTodos(null, (err: any, response: any) => {
    //
    //     console.log("read the todos from server " + JSON.stringify(response))
    //     if (!response.items)
    //         response.items.forEach((a: TodoItem)=>console.log(a.text));
    // });

    const call = client.readTodosStream();
    call.on("data", (item: TodoItem) => {
        console.log("received item from server " + JSON.stringify(item))
    });

    call.on("end", (e: any) => console.log("server done!"));

    res.send();
});

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.get('*', (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };