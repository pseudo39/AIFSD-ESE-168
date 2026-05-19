const mongoose = require("mongoose");

const AIAnalysisSchema = new mongoose.Schema(
  {
    urgency: { type: String, default: "" },           // e.g., "High", "Medium", "Low"
    department: { type: String, default: "" },         // e.g., "Water Supply Dept"
    autoResponse: { type: String, default: "" },       // AI-generated response to user
    summary: { type: String, default: "" },            // Short AI summary of complaint
  },
  { _id: false }
);

const ComplaintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    title: {
      type: String,
      required: [true, "Complaint title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Water Supply",
        "Electricity",
        "Garbage",
        "Roads",
        "Sanitation",
        "Other",
      ],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    aiAnalysis: {
      type: AIAnalysisSchema,
      default: () => ({}),
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,   // null if submitted without login
    },
  },
  { timestamps: true }
);

// Index for location-based search
ComplaintSchema.index({ location: "text" });

module.exports = mongoose.model("Complaint", ComplaintSchema);
