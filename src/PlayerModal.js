import React, { useState } from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root')

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function PlayerModal({ onSubmit }) {
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [startingPlayer, setStartingPlayer] = useState('X');
  const [isAI, setIsAI] = useState(false);

  function handleFormSubmit(event) {
    event.preventDefault();
    onSubmit(playerX, isAI ? "AI" : playerO, startingPlayer, isAI);
  }

  return (
    <Modal
      isOpen={true}
      onRequestClose={() => { }}
      style={customStyles}
      contentLabel='Player Settings Modal'
    >
      <h2>Enter Player Names:</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>
            Player X Name:
            <input
              type="text"
              value={playerX}
              onChange={(e) => setPlayerX(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Player O:
            <select value={isAI ? 'AI' : 'Human'} onChange={(e) => setIsAI(e.target.value === 'AI')}>
              <option value="Human">Human</option>
              <option value="AI">AI</option>
            </select>
          </label>
          {isAI ? null : (
            <label>
              Player O Name:
              <input
                type="text"
                value={playerO}
                onChange={(e) => setPlayerO(e.target.value)}
                required
              />
            </label>
          )}
        </div>
        <div>
          <label>
            Who goes first:
            <select
              value={startingPlayer}
              onChange={(e) => setStartingPlayer(e.target.value)}
            >
              <option value="X">Player X</option>
              <option value="O">Player O</option>
            </select>
          </label>
        </div>
        <button type="submit">Start Game!</button>
      </form>
    </Modal >
  );
}