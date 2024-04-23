import { useState } from 'react';
import './Main.css';

const Main = () => {
  const [board, setBoard] = useState([
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
  ]);

  const handleInputChange = (e, rowIndex, colIndex) => {
    const inputValue = e.target.value.toUpperCase(); // Convert input to uppercase
    const isValidInput = /^[A-Z]$/.test(inputValue); // Check if input is a single letter
    
    if (isValidInput || inputValue === '') { // Allow empty string for clearing
      const newBoard = [...board];
      newBoard[rowIndex][colIndex] = inputValue;
      setBoard(newBoard);
    }
  };

  return (
    <div className='container'>
      <h1 className='title'>WordleClone</h1>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((letter, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                className="box"
                maxLength={1}
                value={letter}
                onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      <div>
      </div>
    </div>
  );
};

export default Main;
