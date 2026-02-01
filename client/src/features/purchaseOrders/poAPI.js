import api from "../../utils/axios";


export const fetchPOsAPI = () =>
  api.get("/purchase-orders").then((res) => res.data);

export const createPOAPI = (data) =>
  api.post("/purchase-orders", data).then((res) => res.data);

export const receivePOAPI = (id, data) =>
  api.post(`/purchase-orders/${id}/receive`, data).then((res) => res.data);

export const updatePOStatusAPI = (poId, status) => {
  return api
    .put(`/purchase-orders/status/${poId}`, { status })
    .then((res) => res.data);
};