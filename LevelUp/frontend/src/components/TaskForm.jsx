// src/components/TaskForm.jsx
import React, { useState } from 'react';
import './TaskForm.css';

// This component has its own state to manage the input field
function TaskForm({ onAddTask }) { // Receives the handler function as a prop
  const [taskText, setTaskText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Stop page refresh
    if (!taskText.trim()) return; // Don't add empty tasks

    onAddTask(taskText); // Call the parent function with the new task text
    setTaskText(''); // Clear the input field
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="task-input"
        placeholder="What's your next quest?"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      />
      <button type="submit" className="task-submit-btn">Add Quest</button>
    </form>
  );
}

export default TaskForm;