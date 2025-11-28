/*
    Simple model to read quiz categories from the database.
*/

const db = require("../db");

// Return all category rows
exports.getAll = callback => {
    db.query("SELECT * FROM categories", callback);
};
