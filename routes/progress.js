/*
	read and write user progress.
*/

const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");

// GET /api/progress/:user_id -> get user's progress
router.get("/:user_id", progressController.getProgress);

// POST /api/progress/update -> update user's progress
router.post("/update", progressController.updateProgress);

module.exports = router;
