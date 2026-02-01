import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
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
    },
    contactEmail: String,
    phone: String,
  },
  { timestamps: true }
);

supplierSchema.index({ name: 1 });

export default mongoose.model("Supplier", supplierSchema);
