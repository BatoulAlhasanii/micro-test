import express, { Request, Response } from 'express';
import {validateRequest} from "../middlewares/validate-request";
import {User} from "../models/user";
import {BadRequestError} from "../errors/bad-request-error";
import {Password} from "../utils/password";
import jwt from 'jsonwebtoken';
import {body} from 'express-validator';

const router = express.Router();

router.post('/api/users/sign-in',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }

       const passwordMatch: boolean = await Password.compare(existingUser.password, password);

        if (!passwordMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email
            },
            'jwt-key' //TODO
        );

        req.session = {
            jwt: userJwt
        };

        res.status(200).send(existingUser);
    }
);

export { router as signInRouter };