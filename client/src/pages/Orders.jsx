import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  createOrder,
  cancelOrder,
} from "../features/orders/orderSlice";
import { fetchProducts } from "../features/products/productSlice";

export default function Orders() {
  const dispatch = useDispatch();

  const { list = [], loading = false } = useSelector(
    (s) => s.orders || {}
  );
  const { list: products = [] } = useSelector(
    (s) => s.products || {}
  );

  const { user } = useSelector((s) => s.auth || {});
  const canManageOrders =
    user?.role === "OWNER" || user?.role === "MANAGER";

  const [form, setForm] = useState({
    productId: "",
    variantId: "",
    quantity: 1,
  });

  const [showCreateModal, setShowCreateModal] = useState(false);

  const selectedProduct = products.find(
    (p) => p._id === form.productId
  );

  useEffect(() => {
    if (canManageOrders) {
      dispatch(fetchOrders());
      dispatch(fetchProducts());
    }
  }, [dispatch, canManageOrders]);

  const submitOrder = async (e) => {
    e.preventDefault();

    if (!form.productId || !form.variantId || !form.quantity) return;

    await dispatch(
      createOrder({
        items: [
          {
            productId: form.productId,
            variantId: form.variantId,
            quantity: Number(form.quantity),
            price: 0,
          },
        ],
      })
    ).unwrap();
    alert("Order Placed")

    setForm({ productId: "", variantId: "", quantity: 1 });
    setShowCreateModal(false);
    dispatch(fetchOrders());
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">
          Inventory Orders (Stock Usage)
        </h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Create Order
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">
                Create Inventory Order
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitOrder} className="space-y-3">
              <select
                className="border p-2 w-full"
                value={form.productId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    productId: e.target.value,
                    variantId: "",
                  })
                }
                required
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {selectedProduct && (
                <select
                  className="border p-2 w-full"
                  value={form.variantId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      variantId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Variant</option>
                  {selectedProduct.variants.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.sku} (Stock: {v.stock})
                    </option>
                  ))}
                </select>
              )}

              <input
                type="number"
                min="1"
                className="border p-2 w-full"
                placeholder="Quantity to consume"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button className="bg-black text-white px-4 py-2 rounded">
                  Create Order
                </button>
              </div>

              <p className="text-xs text-gray-500">
                This creates an inventory consumption order (stock OUT).
              </p>
            </form>
          </div>
        </div>
      )}
      {canManageOrders && (
        <>
      <h2 className="font-medium mb-2">Order History</h2>

      {loading && <p>Loading...</p>}

      <ul className="space-y-3">
        {list.map((o) => (
          <li key={o._id} className="border p-4 rounded">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                Status: {o.status}
              </span>

              {o.status === "PLACED" && (
                <button
                  onClick={() => dispatch(cancelOrder(o._id))}
                  className="text-red-600 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>

            <ul className="text-sm text-gray-700">
              {o.items.map((i, idx) => {
                const product = products.find(
                  (p) => p._id === i.productId
                );
                const variant = product?.variants.find(
                  (v) => v._id === i.variantId
                );

                return (
                  <li key={idx}>
                    • {product?.name || "Unknown Product"} (
                    {variant?.sku || "N/A"}) | Qty:{" "}
                    {i.quantity} | Placed on:{" "}
                    {new Date(o.createdAt).toLocaleString()}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
        </>
      )}
      
    </div>
  );
}
