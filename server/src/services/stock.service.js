import Product from "../models/Product.model.js";
import StockMovement from "../models/StockMovement.model.js";


export const adjustStock = async ({
  tenantId,
  productId,
  variantId,
  type,
  quantity,
  reference,
  userId,
  session = null,
}) => {

  if (quantity === 0) {
    throw new Error("Quantity cannot be zero");
  }

  const product = await Product.findOne(
    {
      _id: productId,
      tenantId,
      "variants._id": variantId,
    },
    null,
    { session }
  );

  if (!product) throw new Error("Product or variant not found");

  const variant = product.variants.id(variantId);

  const newStock = variant.stock + quantity;

  if (newStock < 0) {
    throw new Error("Insufficient stock");
  }

 
  variant.stock = newStock;
  await product.save({ session });

  await StockMovement.create(
    [
      {
        tenantId,
        productId,
        variantId,
        type,
        quantity,
        reference,
        createdBy: userId,
      },
    ],
    { session }
  );

  return newStock;
};
