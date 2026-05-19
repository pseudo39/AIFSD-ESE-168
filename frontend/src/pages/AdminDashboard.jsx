import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved", "Rejected"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState({});
  const [addAdminMsg, setAddAdminMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  useEffect(() => {
    setLoading(true);
    api
      .get("/complaints")
      .then(({ data }) => setComplaints(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = (id, value) => {
    setComplaints((prev) => prev.map((c) => (c._id === id ? { ...c, status: value } : c)));
  };

  const updateStatus = async (id) => {
    setUpdating((s) => ({ ...s, [id]: true }));
    try {
      const payload = { status: complaints.find((c) => c._id === id).status };
      const { data } = await api.put(`/complaints/${id}`, payload);
      setComplaints((prev) => prev.map((c) => (c._id === id ? data : c)));
    } catch (err) {
      // ignore for now
    } finally {
      setUpdating((s) => ({ ...s, [id]: false }));
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAddAdminMsg("");
    try {
      await api.post("/auth/add-admin", form);
      setAddAdminMsg("Admin created successfully");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setAddAdminMsg(err?.response?.data?.message || "Failed to add admin");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">All Complaints</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="p-2">Title</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Submitted By</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="p-2">{c.title}</td>
                    <td className="p-2">{c.category}</td>
                    <td className="p-2">{c.location}</td>
                    <td className="p-2">{c.status}</td>
                    <td className="p-2">{c.name}</td>
                    <td className="p-2">{new Date(c.createdAt).toLocaleString()}</td>
                    <td className="p-2 flex gap-2 items-center">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c._id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => updateStatus(c._id)}
                        disabled={updating[c._id]}
                        className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      >
                        {updating[c._id] ? "Updating..." : "Update"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Add Admin</h2>
        <form onSubmit={handleAddAdmin} className="space-y-3 max-w-md">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full border px-3 py-2 rounded"
          />
          <div>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Create Admin</button>
          </div>
          {addAdminMsg && <p className="text-sm mt-2">{addAdminMsg}</p>}
        </form>
      </section>
    </div>
  );
}
