import { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { autosizeDescriptions } from './description-autoresizer';

export default function Task({ task, columnId, boardId, setBoards }) {

  useEffect(() => {
    autosizeDescriptions();
  }, []); 

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
      id: task.id,
      data: { type: 'task' },
    });

  const priority_mapping = ['Low', 'Medium', 'High'];

  const updateTask = (field, value) => {
    setBoards(prev => prev.map(board => 
      board.id === boardId ? {
        ...board,
        columns: board.columns.map(col => 
          col.id === columnId ? {
            ...col,
            tasks: col.tasks.map(t => 
              t.id === task.id ? { ...t, [field]: value } : t
            )
          } : col
        )
      } : board
    ));
  };

  const deleteTask = () => {
    setBoards(prev => prev.map(board => 
      board.id === boardId ? {
        ...board,
        columns: board.columns.map(col => 
          col.id === columnId ? {
            ...col,
            tasks: col.tasks.filter(t => t.id !== task.id)
          } : col
        )
      } : board
    ));
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      className={`card task-card ${task.completed ? 'task-completed' : 'task-active'} priority-${priority_mapping[task.priority].toLowerCase()}`}
      ref={setNodeRef}
      {...attributes}
      style={style}
    >
      <a {...listeners} className="draggable"> ⋮ </a>
      <button 
        className="completion-button" 
        onClick={() => updateTask('completed', !task.completed)}
      >
        {task.completed ? '✓' : '✕'}
      </button>
      
      <input
        type="text"
        value={task.title}
        onChange={(e) => updateTask('title', e.target.value)}
      />
      
      <textarea
        className="autosized-description"
        value={task.description}
        onChange={(e) => updateTask('description', e.target.value)}
      />
      
      <button className="priority-button" onClick={() => updateTask('priority', (task.priority + 1) % 3)}>
        {priority_mapping[task.priority]}
      </button>
      
      <button 
        className="deletion-button" 
        onClick={() => deleteTask()}
      >
        Delete
      </button>
    </div>
  );
}
