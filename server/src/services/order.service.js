import mongoose from "mongoose";
import Order from "../models/Order.model.js";
import { adjustStock } from "./stock.service.js";

export const createOrderTransaction = async ({
  tenantId,
  items,
  userId,
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let totalAmount = 0;

    for (const item of items) {
      totalAmount += item.price * item.quantity;

      await adjustStock({
        tenantId,
        productId: item.productId,
        variantId: item.variantId,
        type: "SALE",
        quantity: -item.quantity,
        reference: "ORDER",
        userId,
        session,
      });
    }

    const order = await Order.create(
      [
        {
          tenantId,
          items,
          totalAmount,
          createdBy: userId,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return order[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const cancelOrderTransaction = async ({
  tenantId,
  orderId,
  userId,
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findOne(
      { _id: orderId, tenantId },
      null,
      { session }
    );

    if (!order) throw new Error("Order not found");
    if (order.status === "CANCELLED") {
      throw new Error("Order already cancelled");
    }

    for (const item of order.items) {
      await adjustStock({
        tenantId,
        productId: item.productId,
        variantId: item.variantId,
        type: "RETURN",
        quantity: item.quantity, 
        reference: "ORDER_CANCEL",
        userId,
        session,
      });
    }

    order.status = "CANCELLED";
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
