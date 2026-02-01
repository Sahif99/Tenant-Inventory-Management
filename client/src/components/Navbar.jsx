import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const role = user?.role;
  const lowStockCount = useSelector(
    (state) => state.lowStock?.lowStock?.length || 0
  );


  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  const links = [
    { to: "/", label: "Dashboard", roles: ["OWNER", "MANAGER", "STAFF"] },
    { to: "/products", label: "Products", roles: ["OWNER", "MANAGER", "STAFF"] },
    { to: "/suppliers", label: "Suppliers", roles: ["OWNER", "MANAGER"] },
    { to: "/purchase-orders", label: "Purchase Orders", roles: ["OWNER", "MANAGER"] },
    { to: "/orders", label: "Orders", roles: ["OWNER", "MANAGER", "STAFF"] },
    { to: "/stock-ledger", label: "Stock Ledger", roles: ["OWNER", "MANAGER", "STAFF"] },
    { to: "/low-stock", label: "Low Stock", roles: ["OWNER", "MANAGER"] },
    { to: "/team", label: "Team", roles: ["OWNER", "MANAGER"] },
  ];

  const roleColor = {
    OWNER: "bg-green-600",
    MANAGER: "bg-green-600",
    STAFF: "bg-green-600",
  };

  return (
    <nav className="bg-gradient-to-r sticky top-0 from-gray-900 to-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <div
            onClick={() => navigate("/")}
            className="font-bold text-lg cursor-pointer tracking-wide"
          >
            <span className="pr-2 text-blue-400">Tenant</span>Inventory
          </div>

          {/* desktop */}
          <div className="hidden md:flex items-center gap-3">
            {links
              .filter((l) => l.roles.includes(role))
              .map((l) => {
                const showBadge =
                  l.to === "/low-stock" && lowStockCount > 0;

                return (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      `relative px-3 py-1 rounded-md text-sm transition ${isActive
                        ? "bg-gray-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                      }`
                    }
                  >
                    <span className="font-mono">{l.label}</span>

                    {showBadge && (
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-full">
                        {lowStockCount}
                      </span>
                    )}
                  </NavLink>
                );
              })}


            <div className="flex items-center gap-2 px-3 py-1 rounded-md">
              <span
                className={`text-xs px-2 py-[2px] rounded-full ${roleColor[role]}`}
              >
                {role}
              </span>
            </div>

            <button
              onClick={logoutHandler}
              className="ml-3 text-sm text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          </div>

          {/*mobile button */}
          <button
            className="md:hidden text-xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* mobile */}
      {open && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700">
          <div className="flex flex-col p-4 space-y-3">
            <div className="pb-3 border-b border-gray-700">

              <span
                className={`inline-block mt-1 text-xs px-2 py-[2px] rounded-full ${roleColor[role]}`}
              >
                {role}
              </span>
            </div>

            {links
              .filter((l) => l.roles.includes(role))
              .map((l) => {
                const showBadge =
                  l.to === "/low-stock" && lowStockCount > 0;

                return (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between text-sm px-2 py-1 rounded ${isActive
                        ? "bg-gray-500"
                        : "text-gray-300 hover:bg-gray-700"
                      }`
                    }
                  >
                    <span>{l.label}</span>

                    {showBadge && (
                      <span className="bg-white text-black text-[10px] font-semibold px-2 py-[2px] rounded-full">
                        {lowStockCount}
                      </span>
                    )}
                  </NavLink>
                );
              })}


            <button
              onClick={() => {
                setOpen(false);
                logoutHandler();
              }}
              className="text-left text-sm text-red-400 pt-2"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
