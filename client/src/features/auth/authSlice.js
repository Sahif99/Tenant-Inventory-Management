import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, registerAPI } from "./authAPI";
import { connectSocket, disconnectSocket } from "../../utils/socket";

const tokenFromStorage = localStorage.getItem("token");
const userFromStorage = localStorage.getItem("user");

export const login = createAsyncThunk("auth/login", loginAPI);
export const register = createAsyncThunk("auth/register", registerAPI);

const authSlice = createSlice({
  name: "auth",
  initialState: {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  token: tokenFromStorage || null,
  loading: false,
  error: null,
},
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      disconnectSocket();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.data.token;
        state.user = action.payload.data.user;
        localStorage.setItem("token", state.token);
        localStorage.setItem("user", JSON.stringify(state.user));
        connectSocket(state.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.data.token;
        state.user = action.payload.data.user;
        localStorage.setItem("token", state.token);
        localStorage.setItem("user", JSON.stringify(state.user));
        connectSocket(state.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
