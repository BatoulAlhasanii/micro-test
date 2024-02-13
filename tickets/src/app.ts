import express, {Request, Response} from 'express';
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

app.use(indexTicketRouter);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(updateTicketRouter);

app.get('*', (req: Request, res: Response) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };