import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLowStock } from "../features/inventory/inventorySlice";

export default function LowStock() {
  const dispatch = useDispatch();
  const { lowStock = [], loading = false } = useSelector(
    (s) => s.lowStock || {}
  );

  useEffect(() => {
    dispatch(fetchLowStock());
  }, [dispatch]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Low Stock Alerts</h1>
        <p className="text-sm text-gray-500">
          Products that require attention based on reorder levels
        </p>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        {loading && (
          <p className="p-4 text-sm text-gray-500">
            Checking inventory levels…
          </p>
        )}

        {!loading && lowStock.length === 0 && (
          <p className="p-4 text-sm text-gray-600">
            All stock levels are healthy.
          </p>
        )}

        {!loading && lowStock.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 sticky top-0 z-10">
                <tr className="text-left text-gray-200">
                  <th className="px-4 py-3 font-medium">
                    Product
                  </th>
                  <th className="px-4 py-3 font-medium">
                    SKU
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    Stock
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    Pending PO
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    Effective
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    Reorder Level
                  </th>
                </tr>
              </thead>

              <tbody>
                {lowStock.map((i, index) => (
                  <tr
                    key={i.variantId}
                    className={`border-t ${
                      index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-3 font-medium">
                      {i.productName}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {i.sku}
                    </td>

                    <td className="px-4 py-3 text-right text-red-500 font-mono font-semibold">
                      {i.stock}
                    </td>

                    <td className="px-4 py-3 text-right font-mono">
                      {i.pendingQty}
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-semibold">
                      {i.effectiveStock}
                    </td>

                    <td className="px-4 py-3 text-right font-mono">
                      {i.reorderLevel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
