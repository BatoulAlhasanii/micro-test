import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import {errorHandler} from "./middlewares/error-handler";
import cookieSession from 'cookie-session';
import {NotFoundError} from "./errors/not-found-error";
import {currentUser} from "./middlewares/current-user";

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

app.get('/api/orders', (req, res) => {
    res.send("Helloo from orders service");
});

app.get('*', (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };