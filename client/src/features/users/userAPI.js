import api from "../../utils/axios";

export const fetchUsersAPI = () =>
  api.get("/users/all").then(res => res.data);

export const createUserAPI = (data) =>
  api.post("/users/create", data).then(res => res.data);
