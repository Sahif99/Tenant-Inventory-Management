import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
    },
    attributes: {
      type: Map,
      of: String, 
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    reorderLevel: {
      type: Number,
      default: 10,
    },
  },
  { _id: true },
);

const productSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    variants: [variantSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

productSchema.index({  name: 1 });
productSchema.index({ "variants.sku": 1 });

export default mongoose.model("Product", productSchema);
