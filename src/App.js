import { useEffect, useState } from "react";
import PlayerModal from "./PlayerModal";

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? 'highlight' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, playerX, playerO }) {
  const { winner, line } = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square);

  let status;
  if (winner) {
    status = `Winner: ${winner === 'X' ? playerX : playerO}`;
  } else if (isDraw) {
    status = 'Draw!! Start a new game';
  } else {
    status = `Next player: ${xIsNext ? playerX : playerO}`;
  }

  function handleClick(i) {
    if (calculateWinner(squares).winner || squares[i] || isDraw) {
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
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} highlight={line.includes(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} highlight={line.includes(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} highlight={line.includes(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} highlight={line.includes(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} highlight={line.includes(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} highlight={line.includes(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} highlight={line.includes(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} highlight={line.includes(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} highlight={line.includes(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [playerX, setPlayerX] = useState(""); // Track Player X name
  const [playerO, setPlayerO] = useState(""); // Track player O name
  const [isAI, setIsAI] = useState(false);
  const [startingPlayer, setStartingPlayer] = useState("X"); // Track who goes first

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [showHistory, setShowHistory] = useState(false);

  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0 ? startingPlayer === "X" : startingPlayer === "O";
  const currentSquares = history[currentMove];

  const { winner, line } = calculateWinner(currentSquares);
  const isDraw = !winner && currentSquares.every(square => square);

  // AI
  useEffect(() => {
    // console.log("AI Turn:", { isAI, xIsNext, winner, isDraw });
    if (isAI && !xIsNext && !winner && !isDraw) {
      const aiMove = getAIMove(currentSquares);
      // console.log("AI Move:", aiMove);
      if (aiMove !== -1) {
        handlePlay(currentSquares.map((square, idx) => idx === aiMove ? "O" : square));
      }
    }
  }, [xIsNext, isAI, currentSquares, winner, isDraw]);

  function getAIMove(squares) {
    const emptySquares = squares.map((sq, idx) => (sq === null ? idx : null)).filter(idx => idx !== null);
    if (emptySquares.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptySquares.length);
      return emptySquares[randomIndex];
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

  function handleNewGame() {
    const confirmNewGame = window.confirm('Are you sure you want to start a new game?');
    if (confirmNewGame) {
      setHistory([Array(9).fill(null)]);
      setCurrentMove(0);
    }
  }

  function handleEndGame() {
    const confirmEndGame = window.confirm('Are you sure you want to end the game?');
    if (confirmEndGame) {
      setIsModalOpen(true);
      setHistory([Array(9).fill(null)]);
      setCurrentMove(0);
    }
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
        <button onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? 'Hide Move History' : 'Show Move History'}
        </button>
        {showHistory && <ol>{moves}</ol>}
        <button onClick={handleNewGame}>New Game</button>
        <button onClick={handleEndGame}>End Game</button>
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
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}