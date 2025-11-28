/*
  adds a purchased gift for a user in database table
*/

const db = require("../db");

// Insert a row into user_gifts for a user's purchase
exports.addGift = (user_id, giftname, callback) => {
    const sql = `
      INSERT INTO user_gifts (user_id, giftname)
      VALUES (?, ?)
    `;
    db.query(sql, [user_id, giftname], (err, result) => {
        if (err) return callback(err);
        callback(null, { id: result.insertId, user_id, giftname });
    });
};
