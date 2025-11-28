/*
	fetch questions by category or all questions
*/

const express = require("express");
const router = express.Router();
const questionsController = require("../controllers/questionsController");

// GET /api/questions/:category -> questions for that category
router.get("/:category", questionsController.getByCategory);

// GET /api/questions/ -> all questions
router.get("/", questionsController.getAll);

module.exports = router;
