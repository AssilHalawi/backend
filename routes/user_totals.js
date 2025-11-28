/*
	read or change aggregated user totals. 
    Use recompute after progress updates and deduct when a user spends XP.
*/

const express = require("express");
const router = express.Router();
const userTotalsController = require("../controllers/userTotalsController");

// POST /api/user_totals/recompute/:user_id -> recompute totals for user
router.post("/recompute/:user_id", userTotalsController.recomputeForUser);

// GET /api/user_totals/:user_id -> get totals for a user
router.get("/:user_id", userTotalsController.getTotals);

// GET /api/user_totals/ -> get totals for all users
router.get("/", userTotalsController.getAll);

// POST /api/user_totals/deduct -> deduct xp (body: { user_id, amount, giftname? })
router.post("/deduct", userTotalsController.deduct);

module.exports = router;
