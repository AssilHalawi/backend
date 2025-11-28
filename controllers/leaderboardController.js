/*
  Provides leaderboard endpoints. It asks the leaderboard model
  for sorted user totals and returns them to the client.
*/

const leaderboardModel = require("../models/leaderboardModel");

exports.getLeaderboard = (req, res) => {
  leaderboardModel.getLeaderboard((err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
};
