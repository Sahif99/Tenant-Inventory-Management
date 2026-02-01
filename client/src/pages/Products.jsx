import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
} from "../features/products/productSlice";
import { useNavigate } from "react-router-dom";
import CreateProductForm from "./CreateProduct";

export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list = [], loading = false } =
    useSelector((s) => s.products || {});
  const { user } = useSelector((s) => s.auth || {});

  const canManageProducts =
    user?.role === "OWNER" || user?.role === "MANAGER";

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await dispatch(deleteProduct(id)).unwrap();
    dispatch(fetchProducts());
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">
            Manage products & variants
          </p>
        </div>

        {canManageProducts && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-4 py-2 rounded-md text-sm"
          >
            + Add Product
          </button>
        )}
      </div>

      {loading && <p className="text-sm">Loading products...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((p) => (
          <div
            key={p._id}
            className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="mb-4">
              <h2 className="font-semibold text-gray-900">
                {p.name}
              </h2>
              <p className="text-sm text-gray-500">
                Variants: {p.variants.length}
              </p>
            </div>

            <div className="flex gap-4 text-sm">
              <button
                onClick={() => navigate(`/products/${p._id}`)}
                className="text-green-700 hover:text-black font-medium"
              >
                View
              </button>

              {canManageProducts && (
                <button
                  onClick={() => navigate(`/products/${p._id}/edit`)}
                  className="text-gray-700 hover:text-black font-medium"
                >
                  Edit
                </button>
              )}

              {canManageProducts && (
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && list.length === 0 && (
        <div className="text-center py-10 text-gray-500 text-sm">
          No products found
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Create Product
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <CreateProductForm
              onSuccess={() => {
                dispatch(fetchProducts());
                setShowModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
