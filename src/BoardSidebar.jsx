export default function BoardSidebar({ boards, activeBoard, setActiveBoard, createBoard, updateBoard, deleteBoard }) {
  return (
    <div className="board-sidebar">
      <div className="heading boards-heading">
        <span>Boards</span>
        <button className="creation-button" onClick={createBoard}>+</button>
      </div>
      
      {boards.map(board => (
        <div key={board.id} className={`card board-card ${activeBoard === board.id ? 'board-active' : 'board-inactive'}`} onClick={() => setActiveBoard(board.id)}>
          <input 
            type="text" 
            value={board.name} 
            onChange={(e) => updateBoard(board.id, e.target.value)}
          />
          <button className="deletion-button" onClick={(e) => {e.stopPropagation(); deleteBoard(board.id);}}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}