import PurchaseOrder from "../models/PurchaseOrder.model.js";
import mongoose from "mongoose";

const toObjectId = (id) => {
  if (!id) return null;
  if (id instanceof mongoose.Types.ObjectId) return id;
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  if (id._id && mongoose.Types.ObjectId.isValid(id._id)) {
    return new mongoose.Types.ObjectId(id._id);
  }
  return null;
};


export const getPendingPOQty = async (tenantId) => {
  const tenantObjectId = toObjectId(tenantId);

  if (!tenantObjectId) {
    console.error("Invalid tenantId:", tenantId);
    return new Map();
  }
 const rows = await PurchaseOrder.aggregate([
    {
      $match: {
        tenantId: tenantObjectId,
        status: { $in: ["SENT", "CONFIRMED"] },
      },
    },
    { $unwind: "$items" },
     {
      $addFields: {
        "items.receivedQty": {
          $ifNull: ["$items.receivedQty", 0],
        },
      },
    },
    {
      $project: {
        productId: "$items.productId",
        variantId: "$items.variantId",
        pendingQty: {
          $max: [
            0,
            {
              $subtract: [
                "$items.orderedQty",
                { $ifNull: ["$items.receivedQty", 0] },
              ],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          productId: "$productId",
          variantId: "$variantId",
        },
        pendingQty: { $sum: "$pendingQty" },
      },
    },
  ]);

  const map = new Map();
  for (const r of rows) {
    map.set(
      `${r._id.productId}_${r._id.variantId}`,
      r.pendingQty,
    );
  }

  return map;
};