import { useState } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove, SortableContext } from '@dnd-kit/sortable';
import Column from './Column';
import Task from './Task'

export default function BoardContent({ board, setBoards }) {
  
  const [activeDragItem, setActiveDragItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveDragItem({
      id: active.id,
      type: active.data.current?.type,
    });
  };

  const handleDragEnd = (event) => {
    // console.log(activeDragItem);
    const { active, over } = event;
    setActiveDragItem(null);
    
    if (!active || !over) return;

    if (active.data.current?.type === 'column') {
      const oldIndex = board.columns.findIndex(col => col.id === active.id)
      const newIndex = board.columns.findIndex(col => col.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return
      
      const newColumns = arrayMove(board.columns, oldIndex, newIndex)
      setBoards(prev => prev.map(b => 
        b.id === board.id ? { ...b, columns: newColumns } : b
      ))
      return
    }

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId){
      console.log(over);
      console.log("Nah.")
      return;
    }


    let sourceColumn, sourceIndex;
    for (const column of board.columns) {
      const index = column.tasks.findIndex(task => task.id === activeId);
      if (index !== -1) {
        sourceColumn = column;
        sourceIndex = index;
        break;
      }
    }
    if (!sourceColumn) return;

    let destColumn, destIndex;
    if (over.data.current?.type === 'column') {
      destColumn = board.columns.find(col => col.id === overId);
      destIndex = destColumn.tasks.length;
    } else {
      const overTaskId = overId;
      for (const column of board.columns) {
        const index = column.tasks.findIndex(task => task.id === overTaskId);
        if (index !== -1) {
          destColumn = column;
          destIndex = index;
          break;
        }
      }
      if (!destColumn) return;
    }

    if (sourceColumn.id === destColumn.id) {
      const newTasks = arrayMove(sourceColumn.tasks, sourceIndex, destIndex);
      const newColumns = board.columns.map(col => 
        col.id === sourceColumn.id ? { ...col, tasks: newTasks } : col
      );
      setBoards(prev => prev.map(b => 
        b.id === board.id ? { ...b, columns: newColumns } : b
      ));
    } else {
      const movedTask = sourceColumn.tasks[sourceIndex];
      const newColumns = board.columns.map(col => {
        if (col.id === sourceColumn.id) {
          return { ...col, tasks: col.tasks.filter(t => t.id !== activeId) };
        } else if (col.id === destColumn.id) {
          const tasks = [...col.tasks];
          tasks.splice(destIndex, 0, movedTask);
          return { ...col, tasks };
        } else {
          return col;
        }
      });
      setBoards(prev => prev.map(b => 
        b.id === board.id ? { ...b, columns: newColumns } : b
      ));
    }
  };

  const createColumn = () => {
    const newColumn = {
      id: crypto.randomUUID(),
      name: `Column ${board.columns.length + 1}`,
      tasks: []
    };
    setBoards(prev => prev.map(b => 
      b.id === board.id ? { ...b, columns: [...b.columns, newColumn] } : b
    ));
  };

  return (
    <div className="board-content">
      <div className="heading columns-heading">
        <span>Columns</span>
        <button className="creation-button" onClick={createColumn}>+</button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={board.columns.map(col => col.id)}>
          <div className="columns-wrapper">
            {board?.columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                boardId={board.id}
                setBoards={setBoards}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeDragItem?.type === 'task' && (() => {
            const task = board.columns.flatMap(col => col.tasks).find(t => t.id === activeDragItem.id);
            return task ? (
              <div className="draggable-task">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </div>
            ) : null;
          })()}
        </DragOverlay>
      </DndContext>
    </div>
  );
}