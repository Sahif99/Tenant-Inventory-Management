import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../features/dashboard/dashboardSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);
  const { data, loading } = useSelector((s) => s.dashboard);
  const { list: products = [] } = useSelector((s) => s.products || {});

  useEffect(() => {
    if (token) dispatch(fetchDashboard());
  }, [token, dispatch]);

  if (loading) return <p className="p-6">Loading dashboard...</p>;
  if (!data) return <p className="p-6">No dashboard data</p>;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Inventory overview & insights
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Inventory Value"
          value={`₹${data.inventoryValue}`}
        />
        <StatCard
          title="Low Stock Items"
          value={data.lowStockCount}
        />
        <StatCard
          title="Top Sellers"
          value={data.topSellers.length}
        />
      </div>

      <section className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-gray-900">
            Top Selling Products
          </h2>
        </div>

        <ul className="divide-y max-h-[320px] overflow-y-auto">
          {data.topSellers.length === 0 && (
            <li className="p-6 text-sm text-gray-500 text-center">
              No sales data available
            </li>
          )}

          {data.topSellers.map((t, index) => {
            const product = products.find((p) => p._id === t._id);

            return (
              <li
                key={t._id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium">
                    {index + 1}
                  </span>

                  <span className="font-medium text-gray-900">
                    {product?.name || "Unknown Product"}
                  </span>
                </div>

                <span className="text-sm text-gray-700">
                  Sold&nbsp;
                  <span className="font-semibold">{t.soldQty}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>


      <section className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-gray-900">
            Stock Movement
          </h2>
        </div>

        <ul className="divide-y max-h-[320px] overflow-y-auto">
          {data.stockTrend.length === 0 && (
            <li className="p-6 text-sm text-gray-500 text-center">
              No stock movement recorded
            </li>
          )}

          {data.stockTrend.map((s, i) => (
            <li
              key={i}
              className="p-4 grid grid-cols-3 items-center hover:bg-gray-50 transition"
            >
              <span className="text-sm text-gray-700">
                {s._id.day}
              </span>

              <span className="justify-self-center text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                {s._id.type}
              </span>

              <span className="justify-self-end text-sm font-semibold text-gray-900">
                Qty: {s.qty}
              </span>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-lg border bg-gray-700 p-4 shadow-sm">
      <p className="text-sm text-gray-100">{title}</p>
      <p className="text-2xl font-semibold text-gray-200 mt-1">
        {value}
      </p>
    </div>
  );
}
