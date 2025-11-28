/*
    compute a user's progress into a single totals row in the user_totals table
*/

const db = require("../db");

// Recompute and store aggregated totals for a user from the progress table
exports.updateTotalsForUser = (user_id, callback) => {
    const sql = `
      INSERT INTO user_totals (user_id, total_xp, total_completed)
      SELECT user_id, COALESCE(SUM(xp),0) AS total_xp, COALESCE(SUM(completed),0) AS total_completed
      FROM progress
      WHERE user_id = ?
      GROUP BY user_id
      ON DUPLICATE KEY UPDATE total_xp = VALUES(total_xp), total_completed = VALUES(total_completed)
    `;
    db.query(sql, [user_id], callback);
};

// Get the stored totals row for a user
exports.getTotals = (user_id, callback) => {
    db.query("SELECT * FROM user_totals WHERE user_id = ?", [user_id], callback);
};

// Get totals for all users
exports.getAllTotals = (callback) => {
    db.query("SELECT * FROM user_totals", callback);
};

// Deduct XP from a user's totals if they have enough
// Calls back with { success: true, row } or { success: false }
exports.deductFromUser = (user_id, amount, callback) => {
    const sql = `
      UPDATE user_totals
      SET total_xp = total_xp - ?
      WHERE user_id = ? AND total_xp >= ?
    `;
    db.query(sql, [amount, user_id, amount], (err, result) => {
        if (err) return callback(err);
        if (result.affectedRows === 0) {
            // No rows updated -> insufficient 
            return callback(null, { success: false, reason: 'insufficient' });
        }

        // Return the updated totals row
        db.query("SELECT * FROM user_totals WHERE user_id = ?", [user_id], (sErr, rows) => {
            if (sErr) return callback(sErr);
            callback(null, { success: true, row: rows[0] });
        });
    });
};
