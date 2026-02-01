import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPOsAPI, createPOAPI, updatePOStatusAPI } from "./poAPI";

export const fetchPOs = createAsyncThunk("po/fetch", fetchPOsAPI);
export const createPO = createAsyncThunk("po/create", createPOAPI);
export const updatePOStatus = createAsyncThunk(
  "po/updateStatus",
  async ({ poId, status }, { rejectWithValue }) => {
    try {
      return await updatePOStatusAPI(poId, status);
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const poSlice = createSlice({
  name: "purchaseOrders",
  initialState: { list: [] },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPOs.fulfilled, (state, action) => {
        state.list = action.payload.data;
      })
      .addCase(createPO.fulfilled, (state, action) => {
        state.list.unshift(action.payload.data);
      })
      .addCase(updatePOStatus.fulfilled, (state, action) => {
        const updatedPO = action.payload.data;
        state.list = state.list.map((po) =>
          po._id === updatedPO._id ? updatedPO : po
        );
      });
  },
});

export default poSlice.reducer;
