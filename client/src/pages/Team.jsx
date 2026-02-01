import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, createUser } from "../features/users/userSlice";

export default function Team() {
  const dispatch = useDispatch();
  const { list = [] } = useSelector((s) => s.users || {});
  const currentRole = useSelector((s) => s.auth.user?.role);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "STAFF",
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createUser(form));

    if (result.meta.requestStatus === "fulfilled") {
      setCreatedUser(result.payload.data);
      setShowCreateModal(false);
      setShowSuccessModal(true);
      setForm({ name: "", email: "", role: "STAFF" });
    }
  };

  const roleBadge = (role) => {
  const map = {
    OWNER: "bg-gray-900 text-white",
    MANAGER: "bg-gray-700 text-white",
    STAFF: "bg-gray-200 text-gray-800",
  };
  return `px-2 py-[2px] rounded-full text-xs font-medium ${map[role]}`;
};


  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Team Management</h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          + Add Team Member
        </button>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800 border-b">
            <tr className="text-sm text-gray-200">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Role</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr
                key={u._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-gray-600">{u.email}</td>
                <td className="p-3 text-center">
                  <span className={roleBadge(u.role)}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {list.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No team members yet
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Add Team Member
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <input
                className="border p-2 w-full rounded"
                placeholder="Full name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <input
                className="border p-2 w-full rounded"
                placeholder="Email address"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />

              <select
                className="border p-2 w-full rounded"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              >
                <option value="STAFF">Staff</option>
                {currentRole === "OWNER" && (
                  <option value="MANAGER">Manager</option>
                )}
              </select>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900">
                  {form.role == "MANAGER" ? "Create Manager" : "Create Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessModal && createdUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              User Created Successfully
            </h2>

            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {createdUser.name}</p>
              <p><strong>Email:</strong> {createdUser.email}</p>
              <p>
                <strong>Role:</strong>{" "}
                <span className={roleBadge(createdUser.role)}>
                  {createdUser.role}
                </span>
              </p>

              <div className="mt-4 p-3 border rounded bg-gray-50">
                <p className="font-medium mb-1">
                  Temporary Password
                </p>

                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm">
                    {createdUser.tempPassword}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        createdUser.tempPassword
                      );
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-sm font-medium text-blue-600"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setCreatedUser(null);
                  setCopied(false);
                }}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
