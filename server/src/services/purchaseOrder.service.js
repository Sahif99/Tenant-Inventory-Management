import mongoose from "mongoose";
import PurchaseOrder from "../models/PurchaseOrder.model.js";
import { adjustStock } from "./stock.service.js";

export const receivePurchaseOrderTransaction = async ({
  tenantId,
  poId,
  receivedItems,
  userId,
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const po = await PurchaseOrder.findOne(
      { _id: poId, tenantId },
      null,
      { session }
    );

    if (!po) throw new Error("Purchase order not found");

    for (const recv of receivedItems) {
      const item = po.items.find(
        (i) =>
          i.productId.toString() === recv.productId &&
          i.variantId.toString() === recv.variantId
      );

      if (!item) throw new Error("Invalid PO item");

      const remaining = item.orderedQty - item.receivedQty;
      if (recv.qty > remaining) {
        throw new Error("Receiving more than ordered");
      }

      await adjustStock({
        tenantId,
        productId: item.productId,
        variantId: item.variantId,
        type: "PURCHASE",
        quantity: recv.qty,
        reference: `PO:${po._id}`,
        userId,
        session,
      });

      item.receivedQty += recv.qty;
    }

   
    const allReceived = po.items.every(
      (i) => i.receivedQty === i.orderedQty
    );

    if (allReceived) po.status = "RECEIVED";

    await po.save({ session });

    await session.commitTransaction();
    session.endSession();

    return po;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
