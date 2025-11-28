/*
  Handles low-level progress storage (xp, level, completed count).
*/

const db = require("../db");

// Read a user's progress row
exports.getProgress = (user_id, callback) => {
    db.query("SELECT * FROM progress WHERE user_id = ?", [user_id], callback);
};

// Insert or update the user's progress row
exports.updateProgress = (user_id, xp, level, completed, callback) => {
    db.query(
        `INSERT INTO progress (user_id, xp, level, completed)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE xp = ?, level = ?, completed = ?`,
        [user_id, xp, level, completed, xp, level, completed],
        callback
    );
};
