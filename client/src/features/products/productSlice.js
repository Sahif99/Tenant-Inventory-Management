import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductsAPI, createProductAPI, fetchProductByIdAPI, updateProductAPI, deleteProductAPI } from "./productAPI";

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  fetchProductsAPI
);

export const createProduct = createAsyncThunk(
  "products/create",
  createProductAPI
);

export const fetchProductById = createAsyncThunk(
  "products/getById",
  fetchProductByIdAPI
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateProductAPI(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  deleteProductAPI
);


const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.current = action.payload.data;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.list.unshift(action.payload.data);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.current = action.payload.data;
        state.list = state.list.map((p) =>
          p._id === action.payload.data._id
            ? action.payload.data
            : p,
        );
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (p) => p._id !== action.payload,
        );
      });
  },
});

export default productSlice.reducer;
