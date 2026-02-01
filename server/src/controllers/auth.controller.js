import Tenant from "../models/Tenant.model.js";
import User from "../models/User.model.js";
import { generateToken } from "../utils/token.js";
import { success, error } from "../utils/response.js";

export const registerTenant = async (req, res) => {
  try {
    const { tenantName, name, email, password } = req.body;

    if (!tenantName || !email || !password) {
      return error(res, "Missing required fields");
    }

    const tenant = await Tenant.create({ name: tenantName });

    const user = await User.create({
      tenantId: tenant._id,
      name,
      email,
      password,
      role: "OWNER",
    });

    const token = generateToken({
      userId: user._id,
      tenantId: tenant._id,
      role: user.role,
    });

    return success(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
      tenant,
    });
  } catch (err) {
    return error(res, err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return error(res, "Invalid credentials", 401);

    const match = await user.comparePassword(password);
    if (!match) return error(res, "Invalid credentials", 401);

    const token = generateToken({
      userId: user._id,
      tenantId: user.tenantId,
      role: user.role,
    });

    return success(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    return error(res, err.message);
  }
};
