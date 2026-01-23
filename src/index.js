import { initializeGame } from './state/game-state';
import { GameController } from './game-controller/game-controller';
import { renderShips } from './ship_placement_ui/ship-placement';
import { obs } from './observer/observable';
import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize the game state
  const game = initializeGame();
  const controller = new GameController(game);

  const humanBoard = game.boards.human;
  const cpuBoard = game.boards.cpu;
  const human = game.players.human;
  const cpu = game.players.cpu;

  // 2. Setup game boards
  human.gameboard.createBoard(10);
  cpu.gameboard.createBoard(10);

  // 3. Query buttons
  const humanRandomBtn = document.querySelector('.random-ships-btn.human');
  const startBtn = document.querySelector('.start-btn');

  // 4. Render boards and ships
  renderShips(human, humanBoard, cpu);
  renderShips(cpu, cpuBoard, cpu);

  // 5. Setup event listeners
  humanRandomBtn.addEventListener('click', () => {
    renderShips(human, humanBoard, humanRandomBtn, cpu);
  });

  cpuBoard.addEventListener('click', (e) => {
    const cell = e.target;
    if (!cell.matches('.cell') || cell.matches('.attacked-cell')) return;

    const [x, y] = cell.dataset.cordinates.split('');
    controller.handlePlayerAttack([Number(x), Number(y)]);
  });

  startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    controller.startGame();
  });

  // 6. Setup UI update handler
  function updateGameUI(gamePhase, player) {
    const gameInfoSec = document.querySelector('.info-container');

    if (gamePhase === 'setup') gameInfoSec.textContent = 'Place your ships';
    if (gamePhase === 'playing') gameInfoSec.textContent = 'Time to fight';
    if (gamePhase === 'gameOver') {
      if (player === cpu) gameInfoSec.textContent = 'Game over: Enemy wins';
      if (player === human) gameInfoSec.textContent = 'Congrats: YOU win!';
    }
  }

  obs.subscribe(updateGameUI);
});
