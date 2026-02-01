import { useEffect } from "react";
import { getSocket } from "../utils/socket";
import { fetchProducts } from "../features/products/productSlice";
import { fetchOrders } from "../features/orders/orderSlice";
import { fetchLedger } from "../features/stock/stockSlice";

export const useRealtime = (dispatch, token) => {
  useEffect(() => {
    if (!token) return;

    const socket = getSocket();
    if (!socket) return;

    socket.on("stock:update", () => {
      dispatch(fetchProducts());
      dispatch(fetchLedger());
    });

    socket.on("order:created", () => {
      dispatch(fetchOrders());
      dispatch(fetchProducts());
    });

    socket.on("order:cancelled", () => {
      dispatch(fetchOrders());
      dispatch(fetchProducts());
    });

    socket.on("po:received", () => {
      dispatch(fetchProducts());
      dispatch(fetchLedger());
    });

    return () => {
      socket.off("stock:update");
      socket.off("order:created");
      socket.off("order:cancelled");
      socket.off("po:received");
    };
  }, [token]);
};
