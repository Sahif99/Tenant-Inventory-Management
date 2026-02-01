import PurchaseOrder from "../models/PurchaseOrder.model.js";
import { receivePurchaseOrderTransaction } from "../services/purchaseOrder.service.js";
import { success, error } from "../utils/response.js";

export const createPO = async (req, res) => {
  try {
    const po = await PurchaseOrder.create({
      tenantId: req.tenantId,
      supplierId: req.body.supplierId,
      items: req.body.items,
      createdBy: req.user.userId,
    });
    return success(res, po, "Purchase order created");
  } catch (err) {
    return error(res, err.message);
  }
};

export const updatePOStatus = async (req, res) => {
  try {
    const { status } = req.body;
  
    const allowedTransitions = {
      DRAFT: ["SENT"],
      SENT: ["CONFIRMED"],
      CONFIRMED: [],
      RECEIVED: [],
    };

    const po = await PurchaseOrder.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    });

    if (!po) return error(res, "Purchase order not found", 404);

    if (!allowedTransitions[po.status]?.includes(status)) {
      return error(
        res,
        `Cannot change status from ${po.status} to ${status}`,
        400,
      );
    }

    po.status = status;
    await po.save();

    const io = req.app.get("io");
    io.to(req.tenantId).emit("po:status:update", po);

    return success(res, po, "PO status updated");
  } catch (err) {
    return error(res, err.message);
  }
};


export const receivePO = async (req, res) => {
  try {
    const po = await receivePurchaseOrderTransaction({
      tenantId: req.tenantId,
      poId: req.params.id,
      receivedItems: req.body.items,
      userId: req.user.userId,
    });

    const io = req.app.get("io");
    io.to(req.tenantId).emit("po:received", po);
    return success(res, po, "Stock received");
  } catch (err) {
    return error(res, err.message);
  }
};

export const getPOs = async (req, res) => {
  try {
    const pos = await PurchaseOrder.find({
      tenantId: req.tenantId,
    }).sort({ createdAt: -1 });
    return success(res, pos);
  } catch (err) {
    return error(res, err.message);
  }
};
