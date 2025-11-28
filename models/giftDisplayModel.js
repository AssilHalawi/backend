/*
  Reads the user's purchased gifts from the `user_gifts` table.
  Returns the gift name and when it was bought.
*/

const db = require("../db");

// Return a promise resolving to the list of gifts for a user
exports.getGiftsByUser = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT giftname, created_at
            FROM user_gifts
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;

        db.query(sql, [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
