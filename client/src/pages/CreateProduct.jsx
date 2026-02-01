import { useDispatch } from "react-redux";
import { createProduct } from "../features/products/productSlice";
import { useState } from "react";

export default function CreateProductForm({ onSuccess, onClose }) {
  const dispatch = useDispatch();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    variants: [
      {
        sku: "",
        price: "",
        stock: "",
        reorderLevel: 10,
        attributes: { size: "", color: "" },
      },
    ],
  });

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
      createProduct({
        ...product,
        variants: product.variants.map((v) => ({
          ...v,
          price: Number(v.price),
          stock: Number(v.stock),
          reorderLevel: Number(v.reorderLevel),
        })),
      })
    ).unwrap();

    onSuccess?.();
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          className="border rounded-md p-2 w-full mt-1"
          value={product.name}
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          className="border rounded-md p-2 w-full mt-1"
          rows={3}
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
        />
      </div>

      <div className="space-y-4">
        {product.variants.map((v, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 space-y-3 bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800">
                Variant #{i + 1}
              </span>

              {product.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-xs text-gray-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                className="border rounded-md p-2"
                placeholder="SKU"
                value={v.sku}
                onChange={(e) =>
                  updateVariant(i, "sku", e.target.value)
                }
                required
              />

              <input
                type="number"
                min="1"
                className="border rounded-md p-2"
                placeholder="Price"
                value={v.price}
                onChange={(e) =>
                  updateVariant(i, "price", e.target.value)
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                className="border rounded-md p-2"
                placeholder="Size"
                value={v.attributes.size}
                onChange={(e) =>
                  updateAttribute(i, "size", e.target.value)
                }
              />

              <input
                className="border rounded-md p-2"
                placeholder="Color"
                value={v.attributes.color}
                onChange={(e) =>
                  updateAttribute(i, "color", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addVariant}
        className="text-sm text-gray-700 hover:text-black"
      >
        + Add Variant
      </button>

      <div className="flex justify-end gap-3 pt-4 border-t">

        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-black text-white text-sm"
        >
          Create Product
        </button>
      </div>
    </form>
  );
}
