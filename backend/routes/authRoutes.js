const express = require("express");
const router = express.Router();
const { signup, login, addAdmin } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/add-admin", protect, adminOnly, addAdmin);

module.exports = router;
