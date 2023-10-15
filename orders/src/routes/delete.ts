import express, {Request, Response} from "express";
import {Order} from "../models/order";
import {requireAuth} from "../middlewares/require-auth";
import {NotFoundError} from "../errors/not-found-error";
import {NotAuthorizedError} from "../errors/not-authorized-error";
import {OrderStatus} from "../types/order-status";
import {OrderCancelledProducer} from "../events/producers/order-cancelled-producer";
import {kafkaWrapper} from "../events/kafka-wrapper";
import {EventDataMap, Subjects} from "../events/types";

const router = express.Router();

router.delete('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId != req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    new OrderCancelledProducer(kafkaWrapper.producer).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    } as EventDataMap[Subjects.OrderCancelled]);

    res.status(204).send();
});

export { router as deleteOrderRouter };