const Complaint = require("../models/Complaint");

// POST /api/complaints
const addComplaint = async (req, res) => {
  try {
    const { name, email, title, description, category, location } = req.body;

    if (!name || !email || !title || !description || !category || !location)
      return res.status(400).json({ message: "All fields are required" });

    const complaint = await Complaint.create({
      name,
      email,
      title,
      description,
      category,
      location,
      submittedBy: req.user ? req.user._id : null,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/complaints
const getAllComplaints = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/complaints/:id
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/complaints/:id
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "In Progress", "Resolved", "Rejected"];

    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/complaints/:id
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });
    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/complaints/search?location=Ghaziabad
const searchByLocation = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location)
      return res.status(400).json({ message: "Location query is required" });

    const complaints = await Complaint.find({
      location: { $regex: location, $options: "i" },
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  searchByLocation,
};
