/*
	authentication: register and login endpoints.
*/

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST /api/auth/register -> handle new user registration
router.post("/register", authController.register);

// POST /api/auth/login -> handle user login
router.post("/login", authController.login);

module.exports = router;
