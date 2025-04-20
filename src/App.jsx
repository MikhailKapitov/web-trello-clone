import { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import BoardSidebar from './BoardSidebar';
import BoardContent from './BoardContent';

export default function App() {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);

  // localStorage load.
  useEffect(() => {
    const saved = localStorage.getItem('boards');
    if (saved) {
      const parsed = JSON.parse(saved);
      setBoards(parsed);
      setActiveBoard(parsed[0]?.id || null);
    }
  }, []);

  // localStorage save.
  useEffect(() => {
    localStorage.setItem('boards', JSON.stringify(boards));
  }, [boards]);

  const createBoard = () => {
    const newBoard = {
      id: crypto.randomUUID(),
      name: `Board ${boards.length + 1}`,
      columns: []
    };
    setBoards([...boards, newBoard]);
  };

  const updateBoard = (id, newName) => {
    setBoards(boards.map(board => 
      board.id === id ? { ...board, name: newName } : board
    ));
  };

  const deleteBoard = (id) => {
    setBoards(boards.filter(board => board.id !== id));
    if (activeBoard === id) setActiveBoard(null);
  };

  return (
    <DndContext>
      <div className="container">
        <BoardSidebar 
          boards={boards}
          activeBoard={activeBoard}
          setActiveBoard={setActiveBoard}
          createBoard={createBoard}
          updateBoard={updateBoard}
          deleteBoard={deleteBoard}
        />
        
        {activeBoard && boards.some(b => b.id === activeBoard) ? (
          <BoardContent 
            board={boards.find(b => b.id === activeBoard)} 
            setBoards={setBoards}
          />
        ) : (
          <div>:P</div>
        )}
      </div>
    </DndContext>
  );
}