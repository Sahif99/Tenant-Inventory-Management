import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchLedgerAPI, adjustStockAPI } from "./stockAPI";

export const fetchLedger = createAsyncThunk(
  "stock/ledger",
  fetchLedgerAPI
);

export const adjustStock = createAsyncThunk(
  "stock/adjust",
  adjustStockAPI
);

const stockSlice = createSlice({
  name: "stock",
  initialState: {
    ledger: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLedger.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.ledger = action.payload.data;
      })
      .addCase(adjustStock.fulfilled, (state, action) => {
      
      });
  },
});

export default stockSlice.reducer;
