import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../features/products/productSlice";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { current, loading } =
    useSelector((s) => s.products || {});

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [id, dispatch]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!current) return <p className="p-6">Product not found</p>;

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate("/products")}
          className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
        >
          ← Back to Products
        </button>

        <button
          onClick={() => navigate(`/products/${id}/edit`)}
          className="bg-black text-white px-4 py-2 rounded text-sm"
        >
          Edit Product
        </button>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">{current.name}</h1>
          {current.description && (
            <p className="text-gray-600 mt-1">
              {current.description}
            </p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">
            Variants ({current.variants.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {current.variants.map((v, i) => (
              <div
                key={i}
                className="border rounded-md p-4 text-sm space-y-1"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">
                    SKU: {v.sku}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span>₹{v.price}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Stock</span>
                  <span>{v.stock}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Reorder Level
                  </span>
                  <span>{v.reorderLevel}</span>
                </div>

                {(v.attributes?.size || v.attributes?.color) && (
                  <div className="pt-2 text-xs text-gray-500">
                    {v.attributes.size && (
                      <span className="mr-2">
                        Size: {v.attributes.size}
                      </span>
                    )}
                    {v.attributes.color && (
                      <span>
                        Color: {v.attributes.color}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
