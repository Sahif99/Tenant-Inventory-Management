import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const initSocket = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error("No token");

      const decoded = jwt.verify(token, env.jwtSecret);
      socket.user = decoded;

      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const { tenantId, userId } = socket.user;

    socket.join(tenantId);

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });
};
