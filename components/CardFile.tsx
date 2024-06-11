// @ts-nocheck
"use client"
import React, { useEffect, useState } from 'react';

const CardFile = () => {
  const [board, setBoard] = useState(Array.from({ length: 4 }, () => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [arrowMoved, setArrowMoved] = useState(false);

  const init = () => {
    setScore(0);
    setBoard(Array.from({ length: 4 }, () => Array(4).fill(0)));
    addTile();
    addTile();
  }

  function getColor(value) {
    const colors = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };
    return colors[value] || '#cdc1b4';
  }

  const addTile = () => {
    const availableCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          availableCells.push({ i, j });
        }
      }
    }
    if (availableCells.length > 0) {
      const { i, j } = availableCells[Math.floor(Math.random() * availableCells.length)];
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => [...row]);
        newBoard[i][j] = Math.random() < 0.8 ? 2 : 4;
        return newBoard;
      });
    }
  }

  const handleKeyPress = (event) => {
    let moved = false;
    switch (event.key) {
      case 'ArrowUp':
        moved = moveUp();
        break;
      case 'ArrowDown':
        moved = moveDown();
        break;
      case 'ArrowLeft':
        moved = moveLeft();
        break;
      case 'ArrowRight':
        moved = moveRight();
        break;
      default:
        break;
    }
    if (moved) {
      addTile();
      setArrowMoved(false);
    }
    if (gameOver()) {
      alert("Game over");
      init();
    }
  }

  const moveUp = () => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row) => [...row]);
      for (let j = 0; j < 4; j++) {
        const column = newBoard.map((row) => row[j]);
        const mergedColumn = merge(column);
        if (JSON.stringify(column) !== JSON.stringify(mergedColumn)) {
          setArrowMoved(true);
          for (let i = 0; i < 4; i++) {
            newBoard[i][j] = mergedColumn[i];
          }
        }
      }
      return newBoard;
    });
    return arrowMoved;
  }

  const moveDown = () => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row) => [...row]);
      for (let j = 0; j < 4; j++) {
        const column = newBoard.map((row) => row[j]).reverse();
        const mergedColumn = merge(column).reverse();
        if (JSON.stringify(column) !== JSON.stringify(mergedColumn)) {
          setArrowMoved(true);
          for (let i = 0; i < 4; i++) {
            newBoard[i][j] = mergedColumn[i];
          }
        }
      }
      return newBoard;
    });
    return arrowMoved;
  }

  const moveLeft = () => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row) => [...row]);
      for (let i = 0; i < 4; i++) {
        const row = newBoard[i];
        const mergedRow = merge(row);
        if (JSON.stringify(row) !== JSON.stringify(mergedRow)) {
          setArrowMoved(true);
          newBoard[i] = mergedRow;
        }
      }
      return newBoard;
    });
    return arrowMoved;
  }

  const moveRight = () => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row) => [...row]);
      for (let i = 0; i < 4; i++) {
        const row = newBoard[i].reverse();
        const mergedRow = merge(row).reverse();
        if (JSON.stringify(row) !== JSON.stringify(mergedRow)) {
          setArrowMoved(true);
          newBoard[i] = mergedRow;
        }
      }
      return newBoard;
    });
    return arrowMoved;
  }

  const merge = (line) => {
    const nonZeroes = line.filter((x) => x !== 0);
    const mergedRow = [];
    for (let i = 0; i < nonZeroes.length; i++) {
      if (i < nonZeroes.length - 1 && nonZeroes[i] === nonZeroes[i + 1]) {
        const mergedValue = 2 * nonZeroes[i];
        setScore((prevScore) => prevScore + mergedValue);
        mergedRow.push(mergedValue);
        i++;
      } else {
        mergedRow.push(nonZeroes[i]);
      }
    }
    while (mergedRow.length < line.length) {
      mergedRow.push(0);
    }
    return mergedRow;
  }

  const gameOver = () => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return false;
        if (i < 3 && board[i][j] === board[i + 1][j]) return false;
        if (j < 3 && board[i][j] === board[i][j + 1]) return false;
      }
    }
    return true;
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    }
  }, [board]);

  console.log('board',board);

  useEffect(()=> {
    init();
  },[]);

  return (
    <div className='flex items-center justify-center h-screen flex-col gap-6 bg-black'>
      <h1 className='text-4xl text-orange-500 underline underline-offset-4'>2048 Game</h1>
      <div>
        <div className='grid grid-cols-4 w-80 border rounded-xl overflow-hidden'>
          {board.map((row, i) => (
            <div className='grid grid-rows-4' key={i}>
              {row.map((cell, j) => (
                <div
                  className='size-20 border bg-[#cdc1b4] font-semibold text-2xl text-black flex items-center justify-center'
                  key={j}
                  style={{ backgroundColor: getColor(board[j][i]) }}
                >
                  {board[j][i] !== 0 ? board[j][i] : ""}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className=' flex items-center justify-between mt-4'>
          <p className=' text-xl'> <strong> Score </strong> : {score}</p>
          <button onClick={init} className='px-6 py-2 bg-red-500 text-white rounded-xl ring-offset-1 ring-0'>Reset</button>
        </div>
      </div>
    </div>
  )
}

export default CardFile;
