/*
    handles user authentication.
    receives register and login requests from routes,
    talks to the user model, and responds to the client.
*/

const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user: hashes password and saves user
exports.register = async (req, res) => {
    const {email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    userModel.register(email, hashed, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "User registered successfully" });
    });
};

// Log a user in: verifies password and returns a token
exports.login = (req, res) => {
    const { email, password } = req.body;

    userModel.getUserByEmail(email, async (err, rows) => {
        if (err) return res.status(500).json(err);
        if (rows.length === 0) return res.status(400).json({ message: "User not found" });

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.status(400).json({ message: "Wrong password" });

        const token = jwt.sign({ id: user.id }, "secret123");

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: { id: user.id, email: user.email }
        });
    });
};
