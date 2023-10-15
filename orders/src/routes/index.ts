import express, {Request, Response} from "express";
import {Order} from "../models/order";
import {requireAuth} from "../middlewares/require-auth";
import {Ticket} from "../models/ticket";

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');

    const tickets = await Ticket.find();
    res.send(tickets);
});

export { router as indexOrderRouter };
