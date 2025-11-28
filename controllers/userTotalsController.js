/*
  manage user totals (like total XP and completed count).
  shows endpoints to read, recompute and deduct from a user's totals.
*/

const userTotalsModel = require("../models/userTotalsModel");
const userGiftsModel = require("../models/userGiftsModel");

// Recompute aggregated totals for a given user from their progress rows
exports.recomputeForUser = (req, res) => {
    const user_id = req.params.user_id;
    userTotalsModel.updateTotalsForUser(user_id, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "User totals recomputed" });
    });
};

// Get aggregated totals for a user
exports.getTotals = (req, res) => {
    const user_id = req.params.user_id;
    userTotalsModel.getTotals(user_id, (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows[0] || { user_id: user_id, total_xp: 0, total_completed: 0 });
    });
};

// Get aggregated totals for all users
exports.getAll = (req, res) => {
    userTotalsModel.getAllTotals((err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
};

// Deduct XP from a user atomically and optionally record a gift purchase
exports.deduct = (req, res) => {
    const { user_id, amount } = req.body;
    if (!user_id || typeof amount !== 'number') {
        return res.status(400).json({ message: 'user_id and numeric amount required' });
    }

    if (amount <= 0) return res.status(400).json({ message: 'amount must be positive' });

    userTotalsModel.deductFromUser(user_id, amount, (err, result) => {
        if (err) return res.status(500).json(err);
        if (!result.success) {
            return res.status(400).json({ message: 'Insufficient XP' });
        }
        // If giftname provided, record the purchase in user_gifts
        const giftname = req.body.giftname;
        if (giftname) {
            userGiftsModel.addGift(user_id, giftname, (gErr) => {
                if (gErr) console.error("Failed to record gift purchase:", gErr);
                // Return totals even if recording the gift fails
                res.json({ message: 'Deducted', totals: result.row, purchased: giftname });
            });
        } else {
            res.json({ message: 'Deducted', totals: result.row });
        }
    });
};
