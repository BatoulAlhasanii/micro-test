import express, { Request, Response } from "express";
import {Order} from "../models/order";
import {NotFoundError} from "../errors/not-found-error";
import {NotAuthorizedError} from "../errors/not-authorized-error";
import {requireAuth} from "../middlewares/require-auth";

const router = express.Router();

router.get('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new NotFoundError();
    }


    if (order.userId != req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    res.send(order);
});

export { router as showOrderRouter };