import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchOrdersAPI,
  createOrderAPI,
  cancelOrderAPI,
} from "./orderAPI";

export const fetchOrders = createAsyncThunk(
  "orders/fetch",
  fetchOrdersAPI
);

export const createOrder = createAsyncThunk(
  "orders/create",
  createOrderAPI
);

export const cancelOrder = createAsyncThunk(
  "orders/cancel",
  cancelOrderAPI
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.list.unshift(action.payload.data);
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (o) => o._id === action.payload.data._id
        );
        if (index !== -1) {
          state.list[index] = action.payload.data;
        }
      });
  },
});

export default orderSlice.reducer;
