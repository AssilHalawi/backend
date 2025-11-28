/*
  return the leaderboard. 
  It joins users to their totals and sorts by total XP.
*/

const db = require("../db");

// Return rows for the public leaderboard sorted by XP
exports.getLeaderboard = (callback) => {
  const sql = `
    SELECT 
      users.id,
      users.email,
      user_totals.total_xp,
      user_totals.total_completed
    FROM user_totals
    JOIN users ON user_totals.user_id = users.id
    ORDER BY user_totals.total_xp DESC;
  `;
  db.query(sql, callback);
};
