import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const CATEGORIES = ["All", "Water Supply", "Electricity", "Garbage", "Roads", "Sanitation", "Other"];

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let res;
      if (location.trim()) {
        res = await api.get(`/complaints/search?location=${location}`);
      } else {
        const params = category !== "All" ? `?category=${category}` : "";
        res = await api.get(`/complaints${params}`);
      }
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [category]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Complaints</h2>

      {/* Search by location */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by location..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          onClick={fetchComplaints}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
        {location && (
          <button
            onClick={() => { setLocation(""); fetchComplaints(); }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              category === c
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <p className="text-center text-gray-500">No complaints found.</p>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <Link
              key={c._id}
              to={`/complaints/${c._id}`}
              className="block bg-white rounded-xl shadow p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{c.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {c.category} · {c.location}
                  </p>
                  <p className="text-sm text-gray-500">By {c.name}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[c.status]}`}>
                  {c.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
