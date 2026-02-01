import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import productReducer from "../features/products/productSlice";
import orderReducer from "../features/orders/orderSlice";
import stockLedgerReducer from "../features/stock/stockSlice";
import supplierReducer from "../features/suppliers/supplierSlice";
import userReducer from "../features/users/userSlice";
import poReducer from "../features/purchaseOrders/poSlice"
import lowStockReducer from "../features/inventory/inventorySlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    products: productReducer,
    orders: orderReducer,
    stockLedger: stockLedgerReducer,
    suppliers: supplierReducer,
    users: userReducer,
    purchaseOrders: poReducer,
    lowStock : lowStockReducer,
  },
});
