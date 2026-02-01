import api from "../../utils/axios";

export const fetchLedgerAPI = () =>
  api.get("/stock/ledger").then((res) => res.data);

export const adjustStockAPI = (data) =>
  api.post("/stock/adjust", data).then((res) => res.data);
