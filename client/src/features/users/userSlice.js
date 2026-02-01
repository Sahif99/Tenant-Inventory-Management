import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsersAPI, createUserAPI } from "./userAPI";

export const fetchUsers = createAsyncThunk(
  "users/fetch",
  fetchUsersAPI
);

export const createUser = createAsyncThunk(
  "users/create",
  createUserAPI
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload.data;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.list.unshift(action.payload.data);
      });
  },
});

export default userSlice.reducer;
