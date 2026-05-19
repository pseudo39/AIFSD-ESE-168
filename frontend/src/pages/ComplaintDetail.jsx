import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved", "Rejected"];

const URGENCY_COLORS = {
  High: "text-red-600 bg-red-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Low: "text-green-600 bg-green-50",
};

export default function ComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/complaints/${id}`).then(({ data }) => {
      setComplaint(data);
      setStatus(data.status);
    });
  }, [id]);

  const handleStatusUpdate = async () => {
    setStatusLoading(true);
    try {
      const { data } = await api.put(`/complaints/${id}`, { status });
      setComplaint(data);
      setMessage("Status updated successfully!");
    } catch {
      setMessage("Failed to update status.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAIAnalyze = async () => {
    setAiLoading(true);
    setMessage("");
    try {
      const { data } = await api.post("/ai/analyze", { complaintId: id });
      setComplaint((prev) => ({ ...prev, aiAnalysis: data.aiAnalysis }));
      setMessage("AI Analysis complete!");
    } catch {
      setMessage("AI analysis failed.");
    } finally {
      setAiLoading(false);
    }
  };

  if (!complaint) return <p className="text-center mt-10">Loading...</p>;

  const ai = complaint.aiAnalysis;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">{complaint.title}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {complaint.category} · {complaint.location} · By {complaint.name}
        </p>
        <p className="text-gray-700 mb-6">{complaint.description}</p>

        {/* Status Update */}
        <div className="flex gap-2 items-center">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={statusLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {statusLoading ? "Updating..." : "Update Status"}
          </button>
        </div>

        {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
      </div>

      {/* AI Analyze Button */}
      <button
        onClick={handleAIAnalyze}
        disabled={aiLoading}
        className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50"
      >
        {aiLoading ? "Analyzing with AI..." : "🤖 Run AI Analysis"}
      </button>

      {/* AI Result Display */}
      {ai && ai.urgency && (
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-800">AI Analysis Results</h3>

          <div className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${URGENCY_COLORS[ai.urgency] || "text-gray-600 bg-gray-50"}`}>
            Priority: {ai.urgency}
          </div>

          <div>
            <p className="text-sm text-gray-500 font-medium">Responsible Department</p>
            <p className="text-gray-800 font-semibold">{ai.department}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-medium">Summary</p>
            <p className="text-gray-700">{ai.summary}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-700 font-medium mb-1">Auto-generated Response to User</p>
            <p className="text-gray-700 text-sm">{ai.autoResponse}</p>
          </div>
        </div>
      )}
    </div>
  );
}
