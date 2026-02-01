import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
  if (!token || socket) return socket;

  socket = io(import.meta.env.VITE_API_BASE, {
    auth: { token },
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
