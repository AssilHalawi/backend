/*
  Handles simple user profile requests. It asks the user model
  for data and sends it back to the client.
*/

const userModel = require("../models/userModel");

// Get a user's basic profile by id
exports.getUser = (req, res) => {
    userModel.getUserById(req.params.id, (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows[0]);
    });
};

// Update a user's profile information
exports.updateUser = (req, res) => {
    const {email} = req.body;

    userModel.updateUser(req.params.id, email, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Profile updated" });
    });
};
