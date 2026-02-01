import api from "../../utils/axios";

export const fetchProductsAPI = () =>
  api.get("/products").then((res) => res.data);

export const createProductAPI = (data) =>
  api.post("/products", data).then((res) => res.data);

export const fetchProductByIdAPI = (id) =>
  api.get(`/products/${id}`).then((res) => res.data);

export const updateProductAPI = (id, data) =>
  api.put(`/products/${id}`, data).then((res) => res.data);

export const deleteProductAPI = (id) =>
  api.delete(`/products/${id}`).then((res) => res.data);
