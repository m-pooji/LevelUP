// index.js
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs'; // <-- 1. IMPORT BCRYPT
import pool from './db.js';      // <-- 2. IMPORT YOUR DB POOL

const app = express();
const PORT = 5000;

// --- Middlewares ---
app.use(cors()); 
app.use(express.json()); 


// --- Routes ---
app.get('/', (req, res) => {
  res.send('Hello from the LevelUP Backend Server!');
});

//
// --- 3. ADD THIS NEW ROUTE ---
//
// API: USER REGISTRATION
app.post('/api/register', async (req, res) => {
  // Use a try...catch block to handle any errors
  try {
    // 1. Get data from the React frontend
    // Your React app will send this in the request "body"
    const { username, email, password, confirmPassword } = req.body;

    // 2. Backend Validation
    // (Your frontend already checked this, but the backend *must* always check again!)
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }
    // (Frontend checked this, but we double-check)
    if (password !== confirmPassword) { 
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // 3. Check if user already exists in the database
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );

    if (existingUsers.length > 0) {
      // If we find a user, send an error
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    // 4. Hash the password
    // We create a "salt" (random string) to add to the password before hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Insert the new user into the 'users' table
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    // `result.insertId` is the new ID of the user we just created (e.g., 1)
    console.log(`New user created with ID: ${result.insertId}`);

    // 6. Send a success response back to React
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      // We send the new user's data back (without the password)
      user: {
        id: result.insertId,
        username: username,
        email: email,
        level: 1, // This is the default from your SQL table
        xp: 0   // This is the default from your SQL table
      }
    });

  } catch (error) {
    // This catches any database errors or other failures
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
});
//
// --- END OF NEW ROUTE ---
//

// index.js

// ... (your existing /api/register route) ...

//
// --- ADD THIS NEW LOGIN ROUTE ---
//
// API: USER LOGIN
app.post('/api/login', async (req, res) => {
  try {
    // 1. Get data from the React frontend
    const { email, password } = req.body;

    // 2. Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter both email and password" });
    }

    // 3. Find the user in the database
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    // 4. Check if user exists
    if (users.length === 0) {
      // We send a generic message for security (don't say "user not found")
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = users[0]; // Get the first (and only) user

    // 5. Compare the frontend password with the hashed password in the DB
    const isPasswordCorrect = await bcrypt.compare(
      password,       // The plain-text password from React
      user.password   // The hashed password from the database
    );

    if (!isPasswordCorrect) {
      // Passwords don't match
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // 6. Login Successful!
    // We send back all the user's data *except* the hashed password.
    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level,
        xp: user.xp
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});
//
// --- END OF NEW LOGIN ROUTE ---
//


// index.js

// ... (your other routes) ...

//
// --- ADD THIS NEW ROUTE ---
//
// API: GET A SINGLE USER'S DATA (for the dashboard)
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user, but DO NOT select their password
    const [users] = await pool.query(
      'SELECT id, username, level, xp FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: users[0] });

  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
//
// --- END OF NEW ROUTE ---
//


// index.js

// ... (your existing /api/users/:userId GET route) ...

//
// --- ADD THIS NEW ROUTE ---
//
// API: UPDATE A USER'S STATS (Level and XP)
app.patch('/api/users/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    const { level, xp } = req.body; // Get the new stats from React

    // 1. Validation
    if (level === undefined || xp === undefined) {
      return res.status(400).json({ success: false, message: "Level and XP are required" });
    }

    // 2. Update the user in the database
    await pool.query(
      'UPDATE users SET level = ?, xp = ? WHERE id = ?',
      [level, xp, userId]
    );

    // 3. Get the fully updated user data
    const [updatedUserRows] = await pool.query(
      'SELECT id, username, level, xp FROM users WHERE id = ?',
      [userId]
    );

    // 4. Send the fresh user data back to React
    res.status(200).json({ 
      success: true, 
      message: "Stats updated!", 
      user: updatedUserRows[0] 
    });

  } catch (error) {
    console.error("Update Stats Error:", error);
    res.status(500).json({ success: false, message: "Server error while updating stats" });
  }
});
//
// --- END OF NEW ROUTE ---
//
// index.js

// ... (your existing /api/login route) ...

//
// --- ADD THIS NEW GET-TASKS ROUTE ---
//
// API: GET ALL TASKS FOR A SPECIFIC USER
app.get('/api/tasks/:userId', async (req, res) => {
  try {
    // 1. Get the user ID from the URL parameters
    const { userId } = req.params;

    // 2. Query the database for all tasks matching that user ID
    // We order by 'created_at DESC' to show the newest tasks first
    const [tasks] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    // 3. Send the list of tasks back to React
    // It's perfectly fine to send an empty array [] if the user has no tasks
    res.status(200).json({ success: true, tasks: tasks });

  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ success: false, message: "Server error while fetching tasks" });
  }
});
//
// --- END OF GET-TASKS ROUTE ---
//
// index.js

// ... (your new /api/tasks/:userId route) ...

//
// --- ADD THIS NEW POST-TASK ROUTE ---
//
// API: CREATE A NEW TASK
app.post('/api/tasks', async (req, res) => {
  try {
    // 1. Get the new task text AND the user's ID from the request body
    // Your React app will have to send both
    const { text, userId } = req.body;

    // 2. Validation
    if (!text || !userId) {
      return res.status(400).json({ success: false, message: "Task text and user ID are required" });
    }

    // 3. Insert the new task into the database
    const [result] = await pool.query(
      'INSERT INTO tasks (user_id, text) VALUES (?, ?)',
      [userId, text]
    );

    // 4. Send the *newly created task* back to React
    // This is a best practice, as it includes the new ID from the database
    const newTask = {
      id: result.insertId,
      user_id: userId,
      text: text,
      completed: false // This is the default
    };

    res.status(201).json({ success: true, task: newTask });

  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ success: false, message: "Server error while creating task" });
  }
});
//
// --- END OF POST-TASK ROUTE ---
//

// index.js

// ... (your existing /api/tasks POST route) ...

//
// --- ADD THIS NEW PATCH-TASK ROUTE ---
//
// API: UPDATE A TASK (e.g., mark as complete)
app.patch('/api/tasks/:taskId', async (req, res) => {
  try {
    // 1. Get the task ID from the URL
    const { taskId } = req.params;
    
    // 2. Get the new 'completed' status from the request body
    const { completed } = req.body;

    // 3. Validation (check if 'completed' was actually sent)
    if (completed === undefined) {
      return res.status(400).json({ success: false, message: "Missing 'completed' status" });
    }

    // 4. Update the database
    const [result] = await pool.query(
      'UPDATE tasks SET completed = ? WHERE id = ?',
      [completed, taskId]
    );

    // 5. Check if a row was actually updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // 6. Send success response
    res.status(200).json({ success: true, message: "Task updated successfully" });

  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ success: false, message: "Server error while updating task" });
  }
});
//
// --- END OF PATCH-TASK ROUTE ---
//
// index.js

// ... (your new /api/tasks/:taskId PATCH route) ...

//
// --- ADD THIS NEW DELETE-TASK ROUTE ---
//
// API: DELETE A TASK
app.delete('/api/tasks/:taskId', async (req, res) => {
  try {
    // 1. Get the task ID from the URL
    const { taskId } = req.params;

    // 2. Delete the task from the database
    const [result] = await pool.query(
      'DELETE FROM tasks WHERE id = ?',
      [taskId]
    );

    // 3. Check if a row was actually deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // 4. Send success response
    res.status(200).json({ success: true, message: "Task deleted successfully" });

  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ success: false, message: "Server error while deleting task" });
  }
});
//
// --- END OF DELETE-TASK ROUTE ---
//


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});