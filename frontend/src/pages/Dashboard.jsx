import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 });

  useEffect(() => {
    api.get("/complaints").then(({ data }) => {
      setStats({
        total: data.length,
        pending: data.filter((c) => c.status === "Pending").length,
        resolved: data.filter((c) => c.status === "Resolved").length,
        inProgress: data.filter((c) => c.status === "In Progress").length,
      });
    });
  }, []);

  const cards = [
    { label: "Total Complaints", value: stats.total, color: "bg-blue-500" },
    { label: "Pending", value: stats.pending, color: "bg-yellow-500" },
    { label: "In Progress", value: stats.inProgress, color: "bg-indigo-500" },
    { label: "Resolved", value: stats.resolved, color: "bg-green-500" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Complaint Dashboard</h1>
      <p className="text-gray-500 mb-8">AI-powered smart complaint management</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`${card.color} text-white rounded-2xl p-5 shadow`}>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-sm mt-1 opacity-90">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Link
          to="/complaints/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          + New Complaint
        </Link>
        <Link
          to="/complaints"
          className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
        >
          View All Complaints
        </Link>
      </div>
    </div>
  );
}
