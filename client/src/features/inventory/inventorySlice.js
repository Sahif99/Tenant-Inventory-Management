import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

export const fetchLowStock = createAsyncThunk(
  "inventory/lowStock",
  async () => {
    const res = await api.get("/inventory/low-stock");
    return res.data;
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    lowStock: [],
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLowStock.fulfilled, (state, action) => {
      state.lowStock = action.payload.data;
    });
  },
});

export default inventorySlice.reducer;
