import express, { Request, Response } from 'express';
import {body, validationResult} from 'express-validator';
import {validateRequest} from "../middlewares/validate-request";
import {BadRequestError} from "../errors/bad-request-error";
import {User} from "../models/user";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/sign-up', [
        body('email')
            .isEmail()
            .withMessage('Email must be validated'),
        body('password')
            .trim()
            .isLength({ min: 4, max : 20 })
            .withMessage('Password must be between 4 and 20 characters')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('Email in use');
        }

        const user = User.build({ email, password });
        await user.save();

        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            'jwt-key' //TODO
        );

        req.session = {
            jwt: userJwt
        };

        res.status(201).send(user);
    }
);

export { router as signUpRouter };