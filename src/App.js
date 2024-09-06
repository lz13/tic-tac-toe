import { useEffect, useState } from "react";
import PlayerModal from "./PlayerModal";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, playerX, playerO }) {
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner === 'X' ? playerX : playerO}`;
  } else {
    status = `Next player: ${xIsNext ? playerX : playerO}`;
  }

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [playerX, setPlayerX] = useState(""); // Track Player X name
  const [playerO, setPlayerO] = useState(""); // Track player O name
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [startingPlayer, setStartingPlayer] = useState("X"); // Track who goes first
  const [isAI, setIsAI] = useState(false);

  const xIsNext = currentMove % 2 === 0 ? startingPlayer === "X" : startingPlayer === "O";
  const currentSquares = history[currentMove];

  // AI
  useEffect(() => {
    if (isAI && !xIsNext && !calculateWinner(currentSquares)) {
      const aiMove = getAIMove(currentSquares);
      if (aiMove !== -1) {
        handlePlay(currentSquares.map((square, idx) => idx === aiMove ? "O" : square));
      }
    }
  }, [xIsNext, isAI, currentSquares]);

  function getAIMove(squares) {
    const emptySquares = squares.map((sq, idx) => (sq === null ? idx : null)).filter(idx => idx !== null);
    if (emptySquares.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptySquares.length);
      return emptySquares[randomIndex] // Randomly select an empty square
    }
    return -1;
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handlePlayerSubmit(playerX, playerO, startingPlayer, isAI) {
    setPlayerX(playerX);
    setPlayerO(playerO);
    setIsAI(isAI);
    setStartingPlayer(startingPlayer);
    setIsModalOpen(false);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      {isModalOpen && (
        <PlayerModal onSubmit={handlePlayerSubmit} />
      )}

      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          playerX={playerX}
          playerO={playerO}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null
}