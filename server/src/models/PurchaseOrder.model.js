import mongoose from "mongoose";

const poItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    orderedQty: {
      type: Number,
      required: true,
    },
    receivedQty: {
      type: Number,
      default: 0,
    },
    costPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const purchaseOrderSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    items: [poItemSchema],
    status: {
      type: String,
      enum: ["DRAFT", "SENT", "CONFIRMED", "RECEIVED"],
      default: "DRAFT",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ createdAt: -1 });

export default mongoose.model("PurchaseOrder", purchaseOrderSchema);
