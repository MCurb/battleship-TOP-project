import { initializeGame } from './state/game-state';
import { renderBoard } from './gameboard_ui/gameboard-ui';
import { renderShips } from './ship_placement_ui/ship-placement';
import { handlePlayerClicks, initializeAttacks } from './attacks_ui/attacks-ui';
import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize the game state
  const game = initializeGame();

  const humanBoard = game.boards.human;
  const cpuBoard = game.boards.cpu;
  const human = game.players.human;
  const cpu = game.players.cpu;

  // 2. Initialize dependent modules
  initializeAttacks(game);

  // 3. Setup game boards
  human.gameboard.createBoard(10);
  cpu.gameboard.createBoard(10);

  // 4. Query buttons
  const playerRandomShips = document.querySelector('.random-ships.player-one');
  const computerRandomShips = document.querySelector(
    '.random-ships.player-two',
  );

  // 5. Render boards and ships
  renderBoard(humanBoard, human, cpu);
  renderBoard(cpuBoard, cpu, human);

  renderShips(human, humanBoard, playerRandomShips, cpu);
  renderShips(cpu, cpuBoard, computerRandomShips, cpu);

  // 6. Setup event listeners
  playerRandomShips.addEventListener('click', () => {
    renderShips(human, humanBoard, playerRandomShips, cpu);
  });

  cpuBoard.addEventListener('click', handlePlayerClicks);
});
