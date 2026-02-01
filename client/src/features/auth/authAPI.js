import api from "../../utils/axios";

export const loginAPI = (data) =>
  api.post("/auth/login", data).then((res) => res.data);

export const registerAPI = (data) =>
  api.post("/auth/register", data).then((res) => res.data);
