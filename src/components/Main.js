// Main.js

import React, { useState, useEffect, useRef } from 'react';
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
  const [activeRow, setActiveRow] = useState(0); // State to track the active row
  const [randomWord, setRandomWord] = useState(''); // State to store the random word
  const [error, setError] = useState(null);
  const inputRefs = useRef([]); // Ref to store input element references

  useEffect(() => {
    // Fetch a random word when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('/wordList.json');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        const { solutions } = data;
        if (!solutions || solutions.length === 0) {
          throw new Error('No solutions found');
        }
        const randomIndex = Math.floor(Math.random() * solutions.length);
        const selectedWord = solutions[randomIndex];
        setRandomWord(selectedWord);
      } catch (error) {
        console.error('Error fetching wordList.json:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Focus on the first input box of the active row when it becomes active
    if (inputRefs.current[activeRow]) {
      inputRefs.current[activeRow][0].focus();
    }
  }, [activeRow]);

  const handleInputChange = (e, rowIndex, colIndex) => {
    const inputValue = e.target.value.toUpperCase();
    const isValidInput = /^[A-Z]$/.test(inputValue);

    if ((isValidInput || inputValue === '') && rowIndex === activeRow) {
      const newBoard = [...board];
      newBoard[rowIndex][colIndex] = inputValue;
      setBoard(newBoard);

      // Move focus to the next box in the row if it's empty
      if (colIndex < board[rowIndex].length - 1 && board[rowIndex][colIndex + 1] === '') {
        inputRefs.current[rowIndex][colIndex + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    if (e.key === 'Backspace' && rowIndex === activeRow) {
      // If the current box is empty, delete the letter in the previous box and move focus
      if (colIndex === 0 && board[rowIndex][colIndex] === '') {
        const prevColIndex = Math.max(colIndex - 1, 0);
        inputRefs.current[rowIndex][prevColIndex].focus();
        setBoard(prevBoard => {
          const newBoard = [...prevBoard];
          newBoard[rowIndex][prevColIndex] = '';
          return newBoard;
        });
      } else if (colIndex > 0 && board[rowIndex][colIndex] === '') {
        inputRefs.current[rowIndex][colIndex - 1].focus();
        setBoard(prevBoard => {
          const newBoard = [...prevBoard];
          newBoard[rowIndex][colIndex - 1] = '';
          return newBoard;
        });
      }
    }
  };

  const handleSubmit = () => {
    setActiveRow(activeRow + 1);
  };

  return (
    <div className='wordcontainer'>
      <h1 className='title mb-2'>WordleClone</h1>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={`rows ${rowIndex === activeRow ? 'active' : ''}`}>
            {row.map((letter, colIndex) => (
              <input
                ref={(el) => {
                  if (el) {
                    if (!inputRefs.current[rowIndex]) {
                      inputRefs.current[rowIndex] = [];
                    }
                    inputRefs.current[rowIndex][colIndex] = el;
                  }
                }}
                key={`${rowIndex}-${colIndex}`}
                className="box"
                maxLength={1}
                value={letter}
                onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                disabled={rowIndex !== activeRow}
              />
            ))}
          </div>
        ))}
      </div>
      <div>
        <button className='submit btn btn-success btn-lg' onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Main;
