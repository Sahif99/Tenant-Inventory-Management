import Product from "../models/Product.model.js";
import { success, error } from "../utils/response.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, variants } = req.body;

    if (!name || !variants || variants.length === 0) {
      return error(res, "Product name and variants required");
    }

    const product = await Product.create({
      tenantId: req.tenantId,
      name,
      description,
      variants,
    });

    return success(res, product, "Product created");
  } catch (err) {
    return error(res, err.message);
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      tenantId: req.tenantId,
      isActive: true,
    }).sort({ createdAt: -1 });

    return success(res, products);
  } catch (err) {
    return error(res, err.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    });

    if (!product) return error(res, "Product not found", 404);

    return success(res, product);
  } catch (err) {
    return error(res, err.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      req.body,
      { new: true }
    );

    if (!product) return error(res, "Product not found", 404);

    return success(res, product, "Product updated");
  } catch (err) {
    return error(res, err.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenantId,
    });

    if (!product) {
      return error(res, "Product not found", 404);
    }

    return success(res, null, "Product permanently deleted");
  } catch (err) {
    return error(res, err.message);
  }
};

