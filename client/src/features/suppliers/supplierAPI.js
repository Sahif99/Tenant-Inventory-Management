import api from "../../utils/axios";

export const fetchSuppliersAPI = () =>
  api.get("/suppliers").then((res) => res.data);

export const createSupplierAPI = (data) =>
  api.post("/suppliers", data).then((res) => res.data);
