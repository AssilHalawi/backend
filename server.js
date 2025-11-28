const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = require("./db");
db.query(`
    CREATE TABLE IF NOT EXISTS user_gifts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        giftname VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) console.error("Failed to ensure user_gifts table:", err);
});

// ✅ ROOT ROUTE FOR TESTING DEPLOYMENT
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/progress", require("./routes/progress"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/questions", require("./routes/questions"));
app.use("/api/user_totals", require("./routes/user_totals"));
app.use("/api/leaderboard", require("./routes/leaderboard"));

const giftDisplayRoutes = require("./routes/giftDisplay");
app.use("/api/user-gifts", giftDisplayRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
