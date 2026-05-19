const Complaint = require("../models/Complaint.model");
const { callOpenRouter } = require("../utils/openrouter");

// POST /api/ai/analyze
// Body: { complaintId }  OR  { title, description, category }
const analyzeComplaint = async (req, res) => {
  try {
    const { complaintId, title, description, category } = req.body;
    console.log(req.body);
    let complaintTitle = title;
    let complaintDesc = description;
    let complaintCategory = category;
    let complaint = null;

    // If complaintId provided, fetch from DB
    if (complaintId) {
      complaint = await Complaint.findById(complaintId);
      if (!complaint)
        return res.status(404).json({ message: "Complaint not found" });
      complaintTitle = complaint.title;
      complaintDesc = complaint.description;
      complaintCategory = complaint.category;
    }

    if (!complaintTitle || !complaintDesc)
      return res
        .status(400)
        .json({ message: "Title and description are required" });

    const systemPrompt = `You are a smart municipal complaint management AI assistant. 
Analyze the given complaint and respond ONLY in the following JSON format (no markdown, no extra text):
{
  "urgency": "<High | Medium | Low>",
  "department": "<Name of the responsible government department>",
  "autoResponse": "<A polite, professional response message to send to the complainant (2-3 sentences)>",
  "summary": "<A concise 1-sentence summary of the complaint>"
}`;

    const userPrompt = `Complaint Title: ${complaintTitle}
Category: ${complaintCategory || "General"}
Description: ${complaintDesc}`;

    const rawResponse = await callOpenRouter(systemPrompt, userPrompt);

    // Parse JSON safely
    let aiResult;
    try {
      // Strip any accidental markdown fences
      const cleaned = rawResponse.replace(/```json|```/g, "").trim();
      aiResult = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({
        message: "AI returned invalid JSON",
        raw: rawResponse,
      });
    }

    // If we had a complaint ID, save the AI result to DB
    if (complaint) {
      complaint.aiAnalysis = aiResult;
      await complaint.save();
    }

    res.json({ aiAnalysis: aiResult, complaintId: complaintId || null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { analyzeComplaint };
