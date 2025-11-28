/*
	returns the list of quiz categories. 
*/

const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");

// GET /api/categories/ -> list categories
router.get("/", categoriesController.getCategories);

module.exports = router;
