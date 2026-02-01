import api from "../../utils/axios";

export const fetchOrdersAPI = () =>
  api.get("/orders").then((res) => res.data);

export const createOrderAPI = (data) =>
  api.post("/orders/create", data).then((res) => res.data);

export const cancelOrderAPI = (id) =>
  api.post(`/orders/${id}/cancel`).then((res) => res.data);
