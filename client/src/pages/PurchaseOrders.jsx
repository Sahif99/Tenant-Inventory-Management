import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPOs, updatePOStatus } from "../features/purchaseOrders/poSlice";
import { fetchSuppliers } from "../features/suppliers/supplierSlice";
import { fetchProducts } from "../features/products/productSlice";
import api from "../utils/axios";

export default function PurchaseOrders() {
  const dispatch = useDispatch();
  const { list = [] } = useSelector((s) => s.purchaseOrders || {});
  const { list: suppliers = [] } = useSelector((s) => s.suppliers || {});
  const { list: products = [] } = useSelector((s) => s.products || {});

  const [showModal, setShowModal] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    dispatch(fetchPOs());
    dispatch(fetchSuppliers());
    dispatch(fetchProducts());
  }, [dispatch]);


  const addItem = () => {
    setItems([
      ...items,
      { productId: "", variantId: "", orderedQty: 1, costPrice: 0 },
    ]);
  };

  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  const createPO = async (e) => {
    e.preventDefault();

    await api.post("/purchase-orders", {
      supplierId,
      items,
    });

    setSupplierId("");
    setItems([]);
    setShowModal(false);
    dispatch(fetchPOs());
  };


  const updateStatus = async (poId, status) => {
    await dispatch(updatePOStatus({ poId, status })).unwrap();
  };

  const receivePO = async (po) => {
    const receiveItems = po.items.map((i) => ({
      productId: i.productId,
      variantId: i.variantId,
      qty: i.orderedQty - i.receivedQty,
    }));

    await api.post(`/purchase-orders/${po._id}/receive`, {
      items: receiveItems,
    });

    dispatch(fetchPOs());
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <p className="text-sm text-gray-500">
            Manage supplier purchase orders
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded-md text-sm"
        >
          + Create PO
        </button>
      </div>

      <div className="space-y-4">
        {list.map((po) => (
          <div
            key={po._id}
            className="bg-white border rounded-lg p-4 space-y-4 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="font-medium">Status:</span>{" "}
                <span className="px-2 py-1 text-xs rounded-full border">
                  {po.status}
                </span>
              </div>

              <div className="flex gap-2">
                {po.status === "DRAFT" && (
                  <button
                    onClick={() => updateStatus(po._id, "SENT")}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                  >
                    Send
                  </button>
                )}

                {po.status === "SENT" && (
                  <button
                    onClick={() => updateStatus(po._id, "CONFIRMED")}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                  >
                    Confirm
                  </button>
                )}

                {po.status === "CONFIRMED" && (
                  <button
                    onClick={() => receivePO(po)}
                    className="px-3 py-1 text-sm bg-black text-white rounded"
                  >
                    Receive Stock
                  </button>
                )}
              </div>
            </div>

            <div className="text-sm divide-y">
              {po.items.map((i, idx) => {
                const product = products.find(
                  (p) => p._id === i.productId
                );
                const variant = product?.variants.find(
                  (v) => v._id === i.variantId
                );

                return (
                  <div
                    key={idx}
                    className="flex justify-between py-2"
                  >
                    <span>
                      {product?.name || "Unknown"}{" "}
                      <span className="text-gray-500">
                        ({variant?.sku || "N/A"})
                      </span>
                    </span>

                    <span className="text-gray-600">
                      {i.receivedQty} / {i.orderedQty}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-gray-500">
              Updated on:{" "}
              {new Date(po.updatedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Create Purchase Order
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={createPO} className="space-y-4">
              <select
                className="border p-2 w-full rounded"
                value={supplierId}
                onChange={(e) =>
                  setSupplierId(e.target.value)
                }
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>

              {items.map((item, idx) => {
                const product = products.find(
                  (p) => p._id === item.productId
                );

                return (
                  <div
                    key={idx}
                    className="border rounded p-3 space-y-2"
                  >
                    <select
                      className="border p-2 w-full rounded"
                      onChange={(e) =>
                        updateItem(
                          idx,
                          "productId",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Product</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>

                    {product && (
                      <select
                        className="border p-2 w-full rounded"
                        onChange={(e) =>
                          updateItem(
                            idx,
                            "variantId",
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Select Variant
                        </option>
                        {product.variants.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.sku}
                          </option>
                        ))}
                      </select>
                    )}

                    <input
                      type="number"
                      min="1"
                      className="border p-2 w-full rounded"
                      placeholder="Ordered Quantity"
                      onChange={(e) =>
                        updateItem(
                          idx,
                          "orderedQty",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                );
              })}

              <button
                type="button"
                onClick={addItem}
                className="border px-3 py-1 rounded text-sm"
              >
                + Add Item
              </button>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button className="bg-black text-white px-4 py-2 rounded">
                  Create PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
