import { useDispatch } from "react-redux";
import {
  fetchProductById,
  updateProduct,
} from "../features/products/productSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProductById(id))
      .unwrap()
      .then((res) => {
        const data = res.data;
        setProduct({
          ...data,
          variants: data.variants.map((v) => ({
            ...v,
            price: String(v.price),
            stock: String(v.stock),
            reorderLevel: String(v.reorderLevel),
          })),
        });
      });
  }, [id, dispatch]);

  if (!product) return <div className="p-6">Loading...</div>;

  const updateVariant = (index, field, value) => {
    const variants = [...product.variants];
    variants[index][field] = value;
    setProduct({ ...product, variants });
  };

  const updateAttribute = (index, key, value) => {
    const variants = [...product.variants];
    variants[index].attributes[key] = value;
    setProduct({ ...product, variants });
  };

  const addVariant = () => {
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        {
          sku: "",
          price: "",
          stock: "",
          reorderLevel: 10,
          attributes: { size: "", color: "" },
        },
      ],
    });
  };

  const removeVariant = (index) => {
    setProduct({
      ...product,
      variants: product.variants.filter((_, i) => i !== index),
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    await dispatch(
      updateProduct({
        id,
        data: {
          ...product,
          variants: product.variants.map((v) => ({
            ...v,
            price: Number(v.price),
            stock: Number(v.stock),
            reorderLevel: Number(v.reorderLevel),
          })),
        },
      })
    ).unwrap();

    navigate("/products");
  };

  return (
    <form onSubmit={submit} className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
          >
            ← Back to Products
          </button>

          <h1 className="text-2xl font-bold mt-3">Edit Product</h1>
          <p className="text-sm text-gray-500">
            Modify product details and variants
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <section className="bg-white border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              Product Information
            </h2>

            <div>
              <label className="text-sm font-medium">
                Product Name
              </label>
              <input
                className="border p-2 w-full mt-1 rounded"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Description
              </label>
              <textarea
                className="border p-2 w-full mt-1 rounded"
                rows={3}
                value={product.description}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </section>

          <section className="bg-white border rounded-lg p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Variants ({product.variants.length})
              </h2>

              <button
                type="button"
                onClick={addVariant}
                className="text-sm border px-3 py-1 rounded"
              >
                + Add Variant
              </button>
            </div>

            {product.variants.map((variant, index) => (
              <div
                key={index}
                className="border rounded-md p-4 space-y-4 bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">
                    Variant #{index + 1}
                  </h3>

                  {product.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-500 text-xs"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="border p-2 rounded"
                    placeholder="SKU"
                    value={variant.sku}
                    onChange={(e) =>
                      updateVariant(index, "sku", e.target.value)
                    }
                    required
                  />

                  <input
                    type="number"
                    min={1}
                    className="border p-2 rounded"
                    placeholder="Price"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariant(index, "price", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    className="border p-2 rounded bg-gray-100 cursor-not-allowed"
                    placeholder="Stock"
                    value={variant.stock}
                    disabled
                  />

                  <input
                    type="number"
                    min={1}
                    className="border p-2 rounded"
                    placeholder="Reorder Level"
                    value={variant.reorderLevel}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        "reorderLevel",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="border p-2 rounded"
                    placeholder="Size"
                    value={variant.attributes.size}
                    onChange={(e) =>
                      updateAttribute(
                        index,
                        "size",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="border p-2 rounded"
                    placeholder="Color"
                    value={variant.attributes.color}
                    onChange={(e) =>
                      updateAttribute(
                        index,
                        "color",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="col-span-4">
          <div className="sticky top-6 space-y-4">
            <div className="bg-white border rounded-lg p-5">
              <h3 className="font-semibold mb-4">
                Product Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium">
                    {product.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Total Variants
                  </span>
                  <span className="font-medium">
                    {product.variants.length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Total Stock
                  </span>
                  <span className="font-medium">
                    {product.variants.reduce(
                      (sum, v) =>
                        sum + Number(v.stock || 0),
                      0
                    )}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded"
            >
              Update Product
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
