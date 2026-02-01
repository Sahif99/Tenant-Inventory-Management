import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLedger } from "../features/stock/stockSlice";

export default function StockLedger() {
  const dispatch = useDispatch();
  const { ledger = [], loading = false } = useSelector(
    (s) => s.stockLedger || {}
  );

  useEffect(() => {
    dispatch(fetchLedger());
  }, [dispatch]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Stock Ledger</h1>
        <p className="text-sm text-gray-500">
          Complete history of stock movements
        </p>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        {loading && (
          <p className="p-4 text-sm text-gray-500">
            Loading stock movements…
          </p>
        )}

        {!loading && ledger.length === 0 && (
          <p className="p-4 text-sm text-gray-500">
            No stock movements found.
          </p>
        )}

        {!loading && ledger.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 sticky top-0 z-10">
                <tr className="text-left text-gray-200">
                  <th className="px-4 py-3 font-medium">
                    Type
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    Quantity
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Reference
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {ledger.map((l, index) => (
                  <tr
                    key={l._id}
                    className={`border-t ${
                      index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-3 font-medium">
                      {l.type}
                    </td>

                    <td className="px-4 py-3 text-right font-mono">
                      {l.quantity}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {l.reference || "-"}
                    </td>

                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap font-mono">
                      {new Date(l.createdAt).toLocaleString()}
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
