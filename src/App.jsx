import { useState, useEffect } from 'react';
import BoardSidebar from './BoardSidebar';
import BoardContent from './BoardContent';

export default function App() {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);

  // localStorage load.
  useEffect(() => {
      const savedBoards = localStorage.getItem('boards');
      const savedActiveBoard = localStorage.getItem('activeBoard');
      
      if (savedBoards) {
        const parsedBoards = JSON.parse(savedBoards);
        setBoards(parsedBoards);
        setActiveBoard(savedActiveBoard || null);
      }
    }, []);

    // localStorage save.
    useEffect(() => {
      localStorage.setItem('boards', JSON.stringify(boards));
    }, [boards]);
    useEffect(() => {
      if (activeBoard !== null) {
        localStorage.setItem('activeBoard', activeBoard);
      }
    }, [activeBoard]);

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
        <div className="boardless-board">:P</div>
      )}
    </div>
  );
}
