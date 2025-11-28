/*
  Manages the user's progress data (xp, level, completed count).
  Gets and updates progress, and calculates total.
*/

const progressModel = require("../models/progressModel");
const userTotalsModel = require("../models/userTotalsModel");

// Get a user's progress summary (level, xp etc.)
exports.getProgress = (req, res) => {
    progressModel.getProgress(req.params.user_id, (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows[0]);
    });
};

// Update a user's progress and refresh totals
exports.updateProgress = (req, res) => {
    const { user_id, xp, level, completed } = req.body;
    progressModel.updateProgress(user_id, xp, level, completed, (err, result) => {
        if (err) return res.status(500).json(err);
        // recompute the user's totals and store them
        userTotalsModel.updateTotalsForUser(user_id, (uErr) => {
            if (uErr) {
                // Log the error but still return success for progress update
                console.error("Error updating user totals:", uErr);
            }
            res.json({ message: "Progress updated successfully" });
        });
    });
};
