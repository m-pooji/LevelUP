// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // <-- 1. IMPORT useParams
import axios from 'axios'; // <-- 2. IMPORT axios
import './DashboardPage.css';
import StatsHeader from '../components/StatsHeader';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const API_URL = 'http://localhost:5000/api'; // 3. Define API URL

// --- NO MORE MOCK DATA ---

function DashboardPage() {
  // 4. Get the userId from the URL!
  const { userId } = useParams();

  // --- State (no change) ---
  const [user, setUser] = useState(null); // Starts as null
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 5. UPDATED useEffect (to fetch real data) ---
  useEffect(() => {
    // We can't use 'async' directly on useEffect, so we make a helper function
    const fetchData = async () => {
      if (!userId) return; // Don't fetch if there's no userId
      
      setIsLoading(true);
      try {
        // Fetch both user data and tasks data at the same time
        const [userResponse, tasksResponse] = await Promise.all([
          axios.get(`${API_URL}/users/${userId}`),
          axios.get(`${API_URL}/tasks/${userId}`)
        ]);
        
        // Set the data into our state
        setUser(userResponse.data.user);
        setTasks(tasksResponse.data.tasks);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // TODO: Handle error (e.g., show an error message)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]); // The empty array [] is now [userId], so it re-fetches if the ID changes

  
  // --- 6. UPDATED Handler Functions (real API calls) ---

  // Simulates: POST /api/tasks
  const handleAddTask = async (taskText) => {
    try {
      // 1. Send the new task to the backend
      const response = await axios.post(`${API_URL}/tasks`, {
        text: taskText,
        userId: userId // We have this from useParams!
      });
      
      // 2. The backend sends back the newly created task (with its new ID)
      const newTask = response.data.task;

      // 3. Add the new task to the *top* of our list in the state
      setTasks(prevTasks => [newTask, ...prevTasks]);

    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

//   // Simulates: PATCH /api/tasks/:taskId
//   const handleToggleComplete = async (taskId, isCompleted) => {
//     // Optimistic UI Update: Update the state *before* the API call
//     // This makes the UI feel fast
//     setTasks(prevTasks =>
//       prevTasks.map(task =>
//         task.id === taskId ? { ...task, completed: !task.completed } : task
//       )
//     );

//     // --- Gamification! (no change) ---
//     if (!isCompleted) {
//       console.log("+10 XP!");
//       setUser(prevUser => ({
//         ...prevUser,
//         xp: prevUser.xp + 10
//       }));
//       // TODO: We should also update the user's XP in the database!
//       // (This is a good "next step" to tell your mentor about)
//     } else {
//       console.log("-10 XP (Undo)");
//       setUser(prevUser => ({
//         ...prevUser,
//         xp: prevUser.xp - 10
//       }));
//     }
    
//     // Now, send the update to the backend in the background
//     try {
//       await axios.patch(`${API_URL}/tasks/${taskId}`, {
//         completed: !isCompleted
//       });
//     } catch (error) {
//       console.error("Error updating task:", error);
//       // If the API call fails, roll back the UI change
//       setTasks(prevTasks =>
//         prevTasks.map(task =>
//           task.id === taskId ? { ...task, completed: isCompleted } : task
//         )
//       );
//       // And roll back the XP
//       setUser(prevUser => ({ ...prevUser, xp: prevUser.xp - (isCompleted ? -10 : 10) }));
//     }
//   };
// src/pages/DashboardPage.jsx

// ... (your imports and other code) ...

  // ... (your handleAddTask function) ...


 // src/pages/DashboardPage.jsx

// ... (your imports and other code) ...

  // ... (your handleAddTask function) ...


  // --- 6. REPLACE THIS ENTIRE FUNCTION ---
  const handleToggleComplete = async (taskId, isCompleted) => {
    // 1. Optimistic UI Update (This makes the checkbox feel instant)
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    try {
      // 2. Update the task in the database
      await axios.patch(`${API_URL}/tasks/${taskId}`, {
        completed: !isCompleted
      });

      // 3. --- FULL LEVELING LOGIC ---
      
      let finalLevel = user.level;
      let finalXp = user.xp;

      if (!isCompleted) {
        // --- LOGIC FOR GAINING XP ---
        
        const xpToNextLevel = user.level * 100;
        const newXpTotal = user.xp + 10;

        // Check for a Level Up!
        if (newXpTotal >= xpToNextLevel) {
          finalLevel = user.level + 1;       // Increment level
          finalXp = newXpTotal - xpToNextLevel; // Reset XP
          console.log("LEVEL UP! New Level:", finalLevel);
        } else {
          // Just add XP, no level up
          finalXp = newXpTotal;
          console.log("+10 XP!");
        }
      } else {
        // --- NEW: LOGIC FOR LOSING XP (UN-CHECKING) ---
        
        console.log("-10 XP (Undo)");
        const newXpTotal = user.xp - 10;

        // Check if we need to "de-level"
        if (newXpTotal < 0) {
          // Only de-level if they are not already Level 1
          if (user.level > 1) {
            // Calculate the XP of the *previous* level's cap
            const prevLevelXpCap = (user.level - 1) * 100;
            
            finalLevel = user.level - 1;       // Go down one level
            // Set XP to the previous cap, minus the 10 we lost
            finalXp = prevLevelXpCap - 10;   // e.g., 100 - 10 = 90 XP
            console.log("DE-LEVELED! Back to Level:", finalLevel);
          } else {
            // We are at Level 1, don't go below 0 XP
            finalXp = 0;
          }
        } else {
          // Just subtract XP, no de-level
          finalXp = newXpTotal;
        }
      }
      
      // 4. Call our API to save the new stats
      const userResponse = await axios.patch(`${API_URL}/users/${userId}/stats`, {
        level: finalLevel,
        xp: finalXp
      });

      // 5. Set the user state with the *official* data from the backend
      setUser(userResponse.data.user);

    } catch (error) {
      console.error("Error toggling task/stats:", error);
      // If anything fails, roll back the UI change
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: isCompleted } : task
        )
      );
    }
  };
  // --- END OF REPLACED FUNCTION ---



  // ... (your handleDeleteTask function and the rest of the file) ...


  // Simulates: DELETE /api/tasks/:taskId
  const handleDeleteTask = async (taskId) => {
    // Optimistic UI Update: Remove from state immediately
    const oldTasks = tasks;
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    
    // Send delete request to backend
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
    } catch (error) {
      console.error("Error deleting task:", error);
      // If it fails, roll back
      setTasks(oldTasks);
    }
  };

  // --- Render Logic (no change) ---
  return (
    <div className="dashboard-container">
      <StatsHeader user={user} />
      
      <TaskForm onAddTask={handleAddTask} />
      
      {isLoading ? (
        <p>Loading quests...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
}

export default DashboardPage;