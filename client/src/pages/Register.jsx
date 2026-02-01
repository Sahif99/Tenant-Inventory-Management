import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    tenantName: "",
    name: "",
    email: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-6 rounded shadow space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">
          Create Your Business
        </h1>

        <input
          type="text"
          placeholder="Business / Tenant Name"
          className="border p-2 w-full rounded"
          value={form.tenantName}
          onChange={(e) =>
            setForm({ ...form, tenantName: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Your Name"
          className="border p-2 w-full rounded"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full rounded"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
