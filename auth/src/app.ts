import express, {Request, Response} from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import {errorHandler} from "./middlewares/error-handler";
import cookieSession from 'cookie-session';
import {NotFoundError} from "./errors/not-found-error";
import { currentUserRouter } from "./routes/current-user";
import {signInRouter} from "./routes/sign-in";
import {signOutRouter} from "./routes/sign-out";
import {signUpRouter} from "./routes/sign-up";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.get('*', (req: Request, res: Response) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };