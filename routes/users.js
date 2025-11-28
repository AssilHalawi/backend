/*
	reading and updating a user's profile
*/

const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// GET /api/users/:id -> get user profile
router.get("/:id", usersController.getUser);

// PUT /api/users/:id -> update user profile
router.put("/:id", usersController.updateUser);

module.exports = router;
