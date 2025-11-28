/*
  Returns the list of gifts a user has. 
  The controller calls the gift display model and sends the data back to the frontend.
*/

const GiftDisplayModel = require("../models/giftDisplayModel");

// Get gifts purchased/owned by a user
exports.getUserGifts = async (req, res) => {
    const userId = req.params.id;

    try {
        const gifts = await GiftDisplayModel.getGiftsByUser(userId);
        res.json(gifts);
    } catch (err) {
        console.error("Gift fetch error:", err);
        res.status(500).json({ error: "Failed to load user gifts" });
    }
};
