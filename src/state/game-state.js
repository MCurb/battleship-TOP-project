import { Player } from '../player/player-class';

let gameInstance = null;

/**
 * Initialize game state. Must be called after DOM is ready.
 */
export function initializeGame() {
  if (gameInstance) return gameInstance;

  gameInstance = {
    players: {
      cpu: new Player(),
      human: new Player(),
    },
    boards: {
      cpu: document.querySelector('.player-two-board'),
      human: document.querySelector('.player-one-board'),
    },
  };

  return gameInstance;
}

/**
 * Get the game instance. Throws if not initialized.
 */
export function getGame() {
  if (!gameInstance) {
    throw new Error(
      'Game not initialized. Call initializeGame() after DOM is ready.',
    );
  }
  return gameInstance;
}
