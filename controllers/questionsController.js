/*
Functions here request questions from the model and return them to the client.
*/

const questionModel = require("../models/questionModel");

// Return questions for a given category
exports.getByCategory = (req, res) => {
    const category = req.params.category;

    questionModel.getByCategory(category, (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
};

// Return all questions (admin/utility)
exports.getAll = (req, res) => {
    questionModel.getAll((err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
};
