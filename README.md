# LevelUP
users table: This will hold all the user info, including the "gamification" fields.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

tasks table: This will hold all the "quests" or to-do items
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    text VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

Oh! I used import syntax (ESM). Let's make one more quick change to package.json.

Open package.json and add this line at the top level (e.g., after "main"):
"type": "module",
This tells Node.js to use the modern import syntax.

Now, let's install the "tools" (packages) we need:

express: The web server framework.

mysql2: The driver to connect to your MySQL database.

cors: Crucial! This stops the "annoying axios errors" (CORS errors) when React (on port 5173) tries to talk to your server (on port 5000).

bcryptjs: For securely hashing (encrypting) user passwords.
**npm install express mysql2 cors bcryptjs
npm install --save-dev nodemon**
package.json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "nodemon index.js"
},
nodemon: A helper tool that automatically restarts your server when you save a file. (We install this as a "dev dependency").
