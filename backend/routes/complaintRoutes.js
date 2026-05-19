const express = require("express");
const router = express.Router();
const {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  searchByLocation,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");

// NOTE: /search MUST come before /:id to avoid route conflict
router.get("/search", searchByLocation);           // GET /api/complaints/search?location=
router.get("/", getAllComplaints);                  // GET /api/complaints
router.post("/", protect, addComplaint);            // POST /api/complaints (auth required)
router.get("/:id", getComplaintById);              // GET /api/complaints/:id
router.put("/:id", protect, updateComplaintStatus);// PUT /api/complaints/:id
router.delete("/:id", protect, deleteComplaint);   // DELETE /api/complaints/:id

module.exports = router;
