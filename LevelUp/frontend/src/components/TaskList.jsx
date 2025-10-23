// src/components/TaskList.jsx
import React from 'react';
import './TaskList.css';

function TaskList({ tasks, onToggleComplete, onDeleteTask }) {
  if (tasks.length === 0) {
    return <p className="no-tasks-message">No quests pending. Add one!</p>;
  }

  return (
    <div className="task-list-container">
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            
            {/* NEW: Wrap checkbox and text in a label for better accessibility and UX */}
            {/* Clicking the text will now also toggle the checkbox */}
            <label className="task-label-wrapper">
              <input
                type="checkbox"
                className="task-checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id, task.completed)}
              />
              <span className="task-text">{task.text}</span>
            </label>
            
            {/* The "Delete" button is all that's left in task-actions */}
            <div className="task-actions">
              <button
                className="task-delete-btn"
                onClick={() => onDeleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;