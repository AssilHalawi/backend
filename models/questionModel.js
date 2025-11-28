/*
  Database helpers to read questions. 
  Provides functions to fetch questions by category name
*/

const db = require("../db");

// Get questions belonging to the named category
exports.getByCategory = (categoryName, callback) => {
    db.query(
        `SELECT q.*
         FROM questions q
         JOIN categories c ON q.category_id = c.id
         WHERE c.name = ?`,
        [categoryName],
        callback
    );
};

// Get all questions
exports.getAll = callback => {
    db.query("SELECT * FROM questions", callback);
};
