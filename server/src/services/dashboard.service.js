import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";
import StockMovement from "../models/StockMovement.model.js";
import mongoose from "mongoose";

export const getInventoryValue = async (tenantId) => {
  const result = await Product.aggregate([
    {
      $match: {
        tenantId: new mongoose.Types.ObjectId(tenantId),
      },
    },
    { $unwind: "$variants" },
    {
      $group: {
        _id: null,
        totalValue: {
          $sum: {
            $multiply: ["$variants.stock", "$variants.price"],
          },
        },
      },
    },
  ]);

  return result[0]?.totalValue || 0;
};

export const getTopSellers = async (tenantId) => {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 30);

  return Order.aggregate([
    {
      $match: {
        tenantId: new mongoose.Types.ObjectId(tenantId),
        createdAt: { $gte: fromDate },
        status: "PLACED",
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        soldQty: { $sum: "$items.quantity" },
      },
    },
    { $sort: { soldQty: -1 } },
    { $limit: 5 },
  ]);
};


export const getStockMovementTrend = async (tenantId) => {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 7);

  return StockMovement.aggregate([
    {
      $match: {
        tenantId: new mongoose.Types.ObjectId(tenantId),
        createdAt: { $gte: fromDate },
      },
    },
    {
      $group: {
        _id: {
          day: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          type: "$type",
        },
        qty: { $sum: "$quantity" },
      },
    },
    { $sort: { "_id.day": 1 } },
  ]);
};

