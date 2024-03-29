import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import {errorHandler} from "./middlewares/error-handler";
import cookieSession from 'cookie-session';
import {NotFoundError} from "./errors/not-found-error";
import {currentUser} from "./middlewares/current-user";
import {indexOrderRouter} from "./routes";
import {showOrderRouter} from "./routes/show";
import {createOrderRouter} from "./routes/new";
import {deleteOrderRouter} from "./routes/delete";

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

app.use(indexOrderRouter);
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.get('*', (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };