import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuppliers } from "../features/suppliers/supplierSlice";
import api from "../utils/axios";

export default function Suppliers() {
  const dispatch = useDispatch();
  const { list = [] } = useSelector((s) => s.suppliers || {});

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
  };

  const createSupplier = async (e) => {
    e.preventDefault();

    await api.post("/suppliers", {
      name,
      contactEmail: email,
      phone,
    });

    resetForm();
    setShowModal(false);
    dispatch(fetchSuppliers());
  };

  return (
    <div className="p-6 space-y-6 mx-auto max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Suppliers
          </h1>
          <p className="text-sm text-gray-500">
            Manage supplier contacts
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded-md text-sm"
        >
          + Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {list.map((s) => (
          <div
            key={s._id}
            className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <p className="font-semibold text-gray-900">
              {s.name}
            </p>

            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p>{s.contactEmail || "No email provided"}</p>
              <p>{s.phone || "No phone provided"}</p>
            </div>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center text-sm text-gray-500 py-10">
          No suppliers added yet
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Add Supplier
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={createSupplier}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Supplier Name
                </label>
                <input
                  className="border rounded-md p-2 w-full mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  className="border rounded-md p-2 w-full mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  className="border rounded-md p-2 w-full mt-1"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-md border text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-black text-white text-sm"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
