import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSuppliersAPI } from "./supplierAPI";

export const fetchSuppliers = createAsyncThunk(
  "suppliers/fetch",
  fetchSuppliersAPI
);

const supplierSlice = createSlice({
  name: "suppliers",
  initialState: { list: [] },
  extraReducers: (builder) => {
    builder.addCase(fetchSuppliers.fulfilled, (state, action) => {
      state.list = action.payload.data;
    });
  },
});

export default supplierSlice.reducer;
