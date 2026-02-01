import Supplier from "../models/Supplier.model.js";
import { success, error } from "../utils/response.js";

export const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create({
      tenantId: req.tenantId,
      ...req.body,
    });
    return success(res, supplier, "Supplier created");
  } catch (err) {
    return error(res, err.message);
  }
};

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({
      tenantId: req.tenantId,
    });
    return success(res, suppliers);
  } catch (err) {
    return error(res, err.message);
  }
};
