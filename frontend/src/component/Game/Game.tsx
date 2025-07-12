import React, { useEffect, useState } from 'react';
import styles from './Game.module.css';
import Modal from '../Modal';
import { useTimer } from '../../hooks/useTimer';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { submitScore } from '../../services/api';

const BOARD_SIZE = 16;
const MINE_COUNT = 40;

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

const generateEmptyBoard = (): Cell[][] =>
  Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );

const plantMines = (board: Cell[][]): void => {
  let placed = 0;
  while (placed < MINE_COUNT) {
    const row = Math.floor(Math.random() * BOARD_SIZE);
    const col = Math.floor(Math.random() * BOARD_SIZE);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      placed++;
    }
  }
};

const calculateAdjacentMines = (board: Cell[][]): void => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col].isMine) continue;
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const r = row + i;
          const c = col + j;
          if (
            r >= 0 &&
            r < BOARD_SIZE &&
            c >= 0 &&
            c < BOARD_SIZE &&
            board[r][c].isMine
          ) {
            count++;
          }
        }
      }
      board[row][col].adjacentMines = count;
    }
  }
};

const Game: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [minesLeft, setMinesLeft] = useState(MINE_COUNT);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [recordModal, setRecordModal] = useState<string>('');

  const { start, stop, reset, elapsedSeconds, isRunning } = useTimer();
  const { leaderboard } = useLeaderboard();

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newBoard = generateEmptyBoard();
    plantMines(newBoard);
    calculateAdjacentMines(newBoard);
    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
    setMinesLeft(MINE_COUNT);
    setFinalTime(null);
    setRecordModal('');
    reset();
  };

  const revealWithFlood = (row: number, col: number, currentBoard: Cell[][]): void => {
    const visited = new Set<string>();
    const queue: [number, number][] = [[row, col]];

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const key = `${r},${c}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const cell = currentBoard[r][c];
      if (cell.isRevealed || cell.isFlagged) continue;

      cell.isRevealed = true;

      if (cell.adjacentMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const nr = r + i;
            const nc = c + j;
            if (
              nr >= 0 && nr < BOARD_SIZE &&
              nc >= 0 && nc < BOARD_SIZE &&
              !(i === 0 && j === 0)
            ) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
    checkWin(currentBoard);
  };

  const handleCellClick = (row: number, col: number, flood = false) => {
    if (gameOver || gameWon) return;
    if (!isRunning) start();

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    flood ? revealWithFlood(row, col, newBoard) : revealCell(row, col, newBoard);
    setBoard(newBoard);
  };

  const revealCell = (row: number, col: number, currentBoard: Cell[][]): void => {
    const cell = currentBoard[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;

    if (cell.isMine) {
      const timeTaken = stop();
      setFinalTime(timeTaken);
      setGameOver(true);
      setBoard([...currentBoard]);

      const initials = localStorage.getItem('minesweeperInitials');
      if (initials && initials.length === 3) {
        submitScore(initials.toUpperCase(), timeTaken).catch(console.error);
      }
      return;
    }
    checkWin(currentBoard);
  };

  const handleRightClick = (
    e: React.MouseEvent,
    row: number,
    col: number
  ) => {
    e.preventDefault();
    if (gameOver || gameWon) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = newBoard[row][col];

    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
      setMinesLeft(minesLeft + (cell.isFlagged ? -1 : 1));
    }

    setBoard(newBoard);
  };

  const checkWin = (currentBoard: Cell[][]) => {
    const allNonMinesRevealed = currentBoard.every(row =>
      row.every(cell => cell.isMine || cell.isRevealed)
    );

    if (allNonMinesRevealed) {
      const timeTaken = stop();
      setFinalTime(timeTaken);
      setGameWon(true);

      const initials = localStorage.getItem('minesweeperInitials');
      if (initials && initials.length === 3) {
        submitScore(initials.toUpperCase(), timeTaken).catch(console.error);

        const personalBest = leaderboard
          .filter(e => e.initials === initials.toUpperCase())
          .reduce((best, e) => Math.min(best, e.time), Infinity);

        const worldRecord = leaderboard.length > 0 ? leaderboard[0].time : Infinity;

        if (timeTaken < personalBest) {
          setRecordModal('🎯 Congrats! This is your personal best!');
        }
        if (timeTaken <= worldRecord) {
          setRecordModal('🌍 New worldwide record! Well done!');
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button className={styles.restartButton} onClick={startNewGame}>🔁 Restart</button>
        <span className={styles.timer}>⏱ Time: {elapsedSeconds.toFixed(2)}s</span>
      </div>

      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`
                  ${styles.cell}
                  ${cell.isRevealed ? styles.revealed : ''}
                  ${cell.isFlagged ? styles.flagged : ''}
                  ${cell.isRevealed && cell.isMine ? styles.mine : ''}
                `}
                onClick={(e) => handleCellClick(rowIndex, colIndex, e.shiftKey)}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
              >
                {cell.isRevealed
                  ? cell.isMine
                    ? '💣'
                    : cell.adjacentMines || ''
                  : cell.isFlagged
                    ? '🚩'
                    : ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Modal isOpen={gameOver} onClose={startNewGame}>
        <div className={styles.modalContent}>
        <span>💥 Game Over — You lasted {finalTime?.toFixed(2)} seconds.</span>
        <button className={styles.restartButton} onClick={startNewGame}>🔁 Play Again</button>
        </div>
      </Modal>

      <Modal isOpen={gameWon} onClose={startNewGame}>
      <div className={styles.modalContent}>
        <span>🎉 You Win! Time: {finalTime?.toFixed(2)} seconds</span>
        <button  className={styles.restartButton} onClick={startNewGame}>🔁 Play Again</button>
      </div>
      </Modal>

      {recordModal && (
        <Modal isOpen={true} onClose={() => setRecordModal('')}>
          {recordModal}
        </Modal>
      )}
    </div>
  );
};

export default Game;
