import { useDroppable, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Task from './Task';

export default function Column({ column, boardId, setBoards }) {
  
  const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({
      id: column.id,
      data: { type: 'column' },
    });


  const updateColumn = (newName) => {
    setBoards(prev => prev.map(board => 
      board.id === boardId ? {
        ...board,
        columns: board.columns.map(col => 
          col.id === column.id ? { ...col, name: newName } : col
        )
      } : board
    ));
  };

  const createTask = () => {
    const newTask = {
      id: crypto.randomUUID(),
      title: `Task ${column.tasks.length + 1}`,
      completed: false,
      description: '',
      priority: 0
    };
    setBoards(prev => prev.map(b => 
        b.id === boardId ? {
          ...b,
          columns: b.columns.map(col => 
            col.id === column.id ? {
              ...col,
              tasks: [...col.tasks, newTask]
            } : col
          )
        } : b
      ));
  };

  const deleteColumn = () => {
    setBoards(prev => prev.map(board => 
      board.id === boardId ? {
        ...board,
        columns: board.columns.filter(col => col.id !== column.id)
      } : board
    ));
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div className="card column-card" ref={setNodeRef} {...attributes} style={style}>
      <div className="heading column-heading">
        <div className="drag-handle draggable" {...listeners}>#</div>
        <input 
          type="text" 
          value={column.name} 
          onChange={(e) => updateColumn(e.target.value)}
        />
        <button className="creation-button" onClick={createTask}>+</button>
        <button className="deletion-button" onClick={deleteColumn}>
          Delete
        </button>
      </div>

      <SortableContext items={column.tasks.map(task => task.id)}>
        <div className="tasks-list">
          {column.tasks.map(task => (
            <Task 
              key={task.id}
              task={task}
              columnId={column.id}
              boardId={boardId}
              setBoards={setBoards}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}