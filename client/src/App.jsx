import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import Orders from "./pages/Orders";
import Suppliers from "./pages/Suppliers";
import PurchaseOrders from "./pages/PurchaseOrders";
import StockLedger from "./pages/StockLedger";
import LowStock from "./pages/LowStock";
import Team from "./pages/Team";
import ProtectedRoute from "./components/ProtectedRoute";
import { useRealtime } from "./hooks/useRealtime";
import AppLayout from "./components/AppLayout";
import ProductDetail from "./pages/ProductDetail";
import EditProduct from "./pages/EditProduct";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useRealtime(dispatch, token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
              <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AppLayout>
              <Products />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
              <ProductDetail />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/:id/edit"
          element={
            <ProtectedRoute>
              <AppLayout>
              <EditProduct />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AppLayout>
              <Orders />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stock-ledger"
          element={
            <ProtectedRoute>
              <AppLayout>
              <StockLedger />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* owner/manager */}

        <Route
          path="/team"
          element={
            <ProtectedRoute roles={["OWNER", "MANAGER"]}>
              <AppLayout>
              <Team />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/suppliers"
          element={
            <ProtectedRoute roles={["OWNER", "MANAGER"]}>
              <AppLayout>
              <Suppliers />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchase-orders"
          element={
            <ProtectedRoute roles={["OWNER", "MANAGER"]}>
              <AppLayout>
              <PurchaseOrders />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/low-stock"
          element={
            <ProtectedRoute roles={["OWNER", "MANAGER"]}>
              <AppLayout>
              <LowStock />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
