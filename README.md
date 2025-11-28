# STEAM Quest

## Project Title and Overview
STEAM Quest is a website built as a small full‑stack web project for the web development course CSC443. the story behind this website is that a young prince fell in love with a princess and wants to impress her, so he needs the players' help to gain xp and buy her gifts.players answer questions in STEAM categories (science technology engineering arts and math), earn XP, level up, and can use XP for gifts. The game has a timed quiz, score per round, progress tracking, and a leaderboard.

How the game works (high level)
- Players sign up / log in with email and password
- Choose a category and play a timed round (timer visible while playing)
- Questions load from the backend by category. Each question includes:
  - text (`title`)
  - optional image (`img`)
  - option choices
  - a correct answer indicator (`answer`)
  - a hint as a tooltip when the user hovers over the question
- Players get XP for correct answers (+10) and lose XP for incorrect ones (-5). XP updates are shown live
- Progress (XP, level, completed count) is stored and aggregated in the backend, to keep track efficiently
- Users can spend XP to buys gifts; purchases are saved in `user_gifts` table in the backend
- A leaderboard ranks users by total XP and displays their email as well as their scores and how many levels they completed

Stack
- Frontend: HTML, CSS, JavaScript, Bootstrap, 2 React widgets for gift and leaderboard components
- Backend: Node.js + Express, with MySQL as the database
- Auth uses `bcrypt` for password hashing and `jsonwebtoken` for token generation


## Front-End Documentation 
- Common / Layout
  - Bootstrap
  - `css/style.css` for custom styles
  - this layout was not changed since project1, just added some files

- index.html
  - login form sends `POST /api/auth/login` and stores returned `steam.user` in `localStorage`
  - prevents navigation to protected pages (`categories.html`, `progress.html`, `leaderboard.html`) if not logged in
  - "Create New Account" button links to `signup.html`where the user creates an account, the information is stored on the backend, and the user can go back to the login page and start playing
  - it no longer relies on local fake data like in project1. Instead, it now connects directly to the Node.js backend, in the MySQL database and sends the email and password to the /api/auth/login endpoint and recieves real user information from the database

- app.js and game.html
  - handles question logic like what questions should be selected, from which category, randomize and don't choose the same question twice...
  - timer:
    - `startTimer()` starts a countdown of 60 seconds with UI flicker when the coutndown reaches 10 seconds, animation, and redirect to `finish.html` when time ends
  - each time a user answers the question:
    - `handleAnswer` shows correct/incorrect messages after user tries
    - plays `correct.mp3` or `wrong.mp3` to give sound effects for each question 
    - adjust XP in real-time
    - nb of questions answered increases 
  - images:
    - only questions in the arts category have images, not all of them
  - XP display:
    - `animateXP` class toggles to animate XP changes
  - app.js has a "Sign Out" button logic that is implemented in many html files like index, progress, leaderboard, which the user can click and signs out immediately, saving the progress
  - In Project 1, app.js and game.html had everything stored locally and the game used static questions. In Project 2, the file had to be updated to work with the backend, load real questions, update progress, handle the timer, and manage XP correctly. So the script became more advanced because it now connects to the database and controls the whole game instead of using fake data.


- progress.html
  - displays aggregated totals: Total XP, Level, Questions Completed.
  - gift UI:
    - accordion section that displays gift cards with emoji, label, and cost, in boxes
    - clicking a gift calls `POST /api/user_totals/deduct` to charge XP and save purchase in the mysql table
  - purchased gifts:
    - a purchased gift section shows gifts the user purchased. It fetches `/api/user_gifts/:user_id` and maps stored names to local gift emoji/labels.
  - In Project 1, the progress page was basic and only showed XP, level, and completed questions by reading them from localStorage, meaning everything was fake and stored on the browser. In Project 2, the page was completely updated to load the real numbers from the backend, using the database to show the user’s actual XP, level, and total completed questions. The gift system also changed: instead of subtracting XP on the frontend, it now sends the purchase to the backend so XP updates correctly in the database. what happens is: when `progress` is updated by `POST /api/progress/update` the server updates `progress` table and calls `user_totals.updateTotalsForUser` to recompute the aggregated totals row for that user (stored in `user_totals`). Also in this project i added a functionality that when the user finishes the game, so completes all 250 questions, a message pops up in the leaderboard that says "You have finished the game! Thank you for helping the prince impress his princess".

- Leaderboard (leaderboard.html + leaderboard-react.js)
  - I added the leaderboard page in Project 2 because this version finally has real users, real XP, and a backend that saves everyone’s progress. Since the data now comes from the database, I can show how all players rank. Project 1 didn’t have any of this, so a leaderboard wasn’t possible yet.
  - Loads `/api/leaderboard`, sorts by `total_xp`, shows top rows, and puts the current user in bold and displays user rank and total XP.

## Back-End Documentation
The backend follows a routes → controllers → models pattern and uses Express + MySQL
Key backend files
- server.js: starts the backend server and connects all API routes so the frontend can communicate with my database

- db.js: creates a `mysql2` connection

- routes: `backend/routes/...`
  - each file wires HTTP endpoints to controller functions

- controllers: `backend/controllers/*`: they call models and respond with JSON 
  - authController.js: register and login
  - categoriesController.js: returns all available quiz categories by calling the category model and sending the result to the user
  - giftDisplayController.js: returns the gifts purchased by a user
  - leaderboardController.js: returns leaderboard rows from the model
  - progressController.js: read progress for a user and update progress; after updating progress it triggers totals calculation
  - questionsController.js: returns all questions for a specific category from the database
  - usersController.js: retrieves a user's basic profile by calling the user model, updates a user’s email or profile info and returns a success message
  - userTotalsController.js: recompute aggregated totals, return all totals, and rmove XP, and record purchased gift into `user_gifts` table
    
- models: `backend/models/*`
    - read quiz categories from the database
    - userModel.js: user CRUD operations (register, find by email, find by id, update)
    - questionModel.js: fetch questions
    - progressModel.js: read and update progress for each user (xp, level, completed)
    - userTotalsModel.js: recompute and store aggregated totals and remove xp if bought gift
    - userGiftsModel.js: insert purchase rows into `user_gifts` table
    - giftDisplayModel.js: read user's purchased gifts and used to display them in progress.html
    - leaderboardModel.js: returns users joined to their totals sorted by XP



## API Endpoints
Auth
- POST /api/auth/register
  - Body: { email, password }
  - Registers a new user with a hashed password using bycrypt
- POST /api/auth/login
  - Body: { email, password }
  - Verifies credentials

Users
- GET /api/users/:id
  - Returns user profile row for the id
- PUT /api/users/:id
  - Body: { email } 
  - Updates a user's profile

Progress
- GET /api/progress/:user_id
  - Returns the user's progress (xp, level, completed)
- POST /api/progress/update
  - Body: { user_id, xp, level, completed }
  - Inserts/updates the progress row and triggers totals calcukations

Categories
- GET /api/categories/
  - Returns available quiz categories

Questions
- GET /api/questions/:category
  - Returns questions for the given category name
- GET /api/questions/
  - Returns all questions

User Totals (aggregated)
- POST /api/user_totals/recompute/:user_id
  - Recompute aggregated totals for the user from `progress`
- GET /api/user_totals/:user_id
  - Get totals for a user (total_xp, total_completed)
- GET /api/user_totals/
  - Get totals for all users
- POST /api/user_totals/deduct
  - Body: { user_id, amount, giftname }
  - removes xp amount from `user_totals.total_xp` for user, the purchase is recorded in `user_gifts`saving the name of the gift

Leaderboard
- GET /api/leaderboard/
  - Returns users joined with `user_totals`, sorted by `total_xp` descending 

Purchased Gifts
- GET /api/user-gifts/:id
  - Returns purchased gifts for the user id. 



## Database Schema
CREATE DATABASE steamquest;

- `users`
  - `id`
  - `email`
  - `password`
  - `created_at`
  - Used for login and leaderboards join
  - CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

- `categories`
  - `id`
  - `name`
  - `color`
  - `emoji` 
  - `description` 
  - Used to map category names to category ids 
  - CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20)
  );
  INSERT INTO categories (name, emoji, description, css_class)
  VALUES
  ('science', '🧪', 'Impress her with nature’s wonders 🌿.', 'category-science'),
  ('tech', '💻', 'Show her the magic of innovation ⚡.', 'category-tech'),
  ('engineering', '⚙️', 'Win her heart with clever builds 🏗️.', 'category-engineering'),
  ('arts', '🎨', 'Paint her a masterpiece to win her heart 💖.', 'category-arts'),
  ('math', '➗', 'Unlock secrets with the power of logic 🔐.', 'category-math');

- `questions`
  - `id`
  - `category_id` (FK)
  - `title`— question text
  - `optionA/B/C/D`(each in a column) 
  - `answer` — correct answer (key, index or text)
  - `hint` — optional hint
  - `img` — optional image URL/filename
  - Contains question rows
  - CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    title TEXT NOT NULL,
    optionA TEXT NOT NULL,
    optionB TEXT NOT NULL,
    optionC TEXT NOT NULL,
    optionD TEXT NOT NULL,
    answer CHAR(1) NOT NULL,
    hint TEXT,
    img VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );
  INSERT INTO questions (category_id, title, optionA, optionB, optionC, optionD, answer, hint, img)
VALUES
  (1, 'Which process allows plants to make their own food?', 'Photosynthesis', 'Respiration', 'Fermentation', 'Transpiration', 'A', 'It uses sunlight to convert CO₂ and water into sugar.', NULL), ...

- `progress`
  - `id`
  - `user_id` (FK)
  - `xp`
  - `level`
  - `completed`
  - track progress at each round
  - CREATE TABLE progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    completed INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

- `user_totals`
  - `user_id`
  - `total_xp`
  - `total_completed`
  - Aggregated totals table used by leaderboard and spending
  - CREATE TABLE user_totals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_xp INT DEFAULT 0,
    total_completed INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );


- `user_gifts`
  - `id`
  - `user_id` (FK)
  - `giftname`
  - Records purchases of gifts per user.
  - CREATE TABLE user_gifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    giftname TEXT NOT NULL
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

- once i created them all i tested the ones i already inserted data to to see if they work correctly: http://localhost:5000/api/categories
- created a test user in MySQL, and checked if the users' progress shows using the url: http://localhost:5000/api/progress/1


## Summary of added features
- User authentication (Register & Login)
- Security feature to restrict unregistered users to enter the game
- Categories loaded from backend
- Dynamic question loading
- Automated XP & progress tracking
- Gift purchase system with XP deduction
- Leaderboard (react component)
- Purchased Gifts Display (react component)
- Backend APIs for all game operations


## Resources Used
- Node: executes js backend code outside the browser
- express: build API routes and handle server requests/responses easily
- cors: allows frontend to communicate with your backend safely
- mysql2: lets backend connect to MySQL and run SQL queries
- bcrypt: hashes and safely encrypts passwords before storing them in the database
- jsonwebtoken: creates secure login tokens so users stay authenticated
- nodemon: automatically restarts the backend server whenever the code changes
  npx nodemon server.js => run backend

CDNs and frontend libraries
- Bootstrap CSS & JS: for quick, responsive styling and prebuilt UI components
  `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/`
- FontAwesome: provides clean, ready-to-use icons (stars, trophies, hearts, menus)
  `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/`
- React: create dynamic, component-based UI elements directly in the browser
 `https://unpkg.com/react@18/umd/react.development.js`
- ReactDOM: handles rendering React components into specific HTML elements
  `https://unpkg.com/react-dom@18/umd/react-dom.development.js`
- Babel standalone: lets browser understand jsx, converts it into plain js at runtime
  `https://unpkg.com/@babel/standalone/babel.min.js`


## Credits
- Assil Halawi
- Course: Web Development, CSC443 
- LAU
- Fall 2025