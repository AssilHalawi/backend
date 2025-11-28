/*
	fetch the gifts owned by a user. 
    Calls the gift display controller which returns the purchases.
*/

const express = require("express");
const router = express.Router();
const giftDisplayController = require("../controllers/giftDisplayController");

// GET /api/giftDisplay/:id -> get a user's purchased gifts
router.get("/:id", giftDisplayController.getUserGifts);

module.exports = router;
