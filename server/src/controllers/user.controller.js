import User from "../models/User.model.js";
import { success, error } from "../utils/response.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!["MANAGER", "STAFF"].includes(role)) {
      return error(res, "Invalid role");
    }

    if (req.user.role === "MANAGER" && role === "MANAGER") {
      return error(res, "Managers cannot create managers", 403);
    }

    const existing = await User.findOne({
      email,
      tenantId: req.tenantId,
    });

    if (existing) {
      return error(res, "User already exists");
    }

    const tempPassword = Math.random().toString(36).slice(-8);

    const user = await User.create({
      tenantId: req.tenantId,
      name,
      email,
      password: tempPassword,
      role,
    });

    return success(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      tempPassword, 
    }, "User created");
  } catch (err) {
    return error(res, err.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      { tenantId: req.tenantId },
      { password: 0 }
    ).sort({ createdAt: -1 });

    return success(res, users);
  } catch (err) {
    return error(res, err.message);
  }
};
