/*
    run SQL queries to create, read and update user records
*/

const db = require("../db");

// Insert a new user into the users table
exports.register = (email, hashedPassword, callback) => {
    db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        callback
    );
};

// Fetch a user row by email
exports.getUserByEmail = (email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

// Fetch a user row by id
exports.getUserById = (id, callback) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], callback);
};

// Update a user's username and email
exports.updateUser = (id, username, email, callback) => {
    db.query(
        "UPDATE users SET username = ?, email = ? WHERE id = ?",
        [username, email, id],
        callback
    );
};
