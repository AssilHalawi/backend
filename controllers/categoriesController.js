const categoryModel = require("../models/categoryModel");

// Return all quiz categories
exports.getCategories = (req, res) => {
    categoryModel.getAll((err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
};
