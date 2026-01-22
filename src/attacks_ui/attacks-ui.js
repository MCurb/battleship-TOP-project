import { renderBoard } from '../gameboard_ui/gameboard-ui';
import { obs } from '../observer/observable';
import { Queue } from '../queue/queue';
import { getRandomInt, enqueueAdjacent } from '../utils/utils';

// --- Module state ---
let turn = 'playerOne';
const attacked = new Set();
const adjacent = new Queue();
const prevAttack = [];
const lastHits = [];

// Game references - will be set during initialization
let human, humanBoard, cpu, cpuBoard;

/**
 * Initialize the attacks module with game dependencies
 */
export function initializeAttacks(gameState) {
  human = gameState.players.human;
  humanBoard = gameState.boards.human;
  cpu = gameState.players.cpu;
  cpuBoard = gameState.boards.cpu;
}

// ========================
// PUBLIC API (exports)
// ========================

export function handlePlayerClicks(e) {
  const cell = e.target;
  if (
    !cell.matches('.cell') ||
    turn !== 'playerOne' ||
    cell.matches('.attacked-cell')
  ) {
    return;
  }

  const [x, y] = cell.dataset.cordinates.split('');
  cpu.gameboard.receiveAttack([Number(x), Number(y)]);

  processAttackRound(cpuBoard, cpu);
  setTimeout(() => {
    computerAttack();
  }, 200);
}

// ========================
// PRIVATE HELPERS
// ========================

function computerAttack() {
  if (turn !== 'computer') return;

  //random attack when game starts
  if (prevAttack.length === 0) {
    prevAttack[0] = randomAttack();
    processAttackRound(humanBoard, human);
    return;
  }

  const [x, y] = prevAttack[0];
  const position = human.gameboard.board[x][y];

  //If prev attack was a hit
  if (Array.isArray(position)) {
    lastHits.push(prevAttack[0]);

    //Keep lastHits max length = 2
    if (lastHits.length > 2) {
      lastHits.shift();
    }

    //If the ship was sunk start again with random attacks
    if (position[0].isSunk()) {
      prevAttack[0] = randomAttack();
      adjacent.cleanQueue();
      lastHits.length = 0;
      processAttackRound(humanBoard, human);
      return;
    }

    if (lastHits.length === 2) {
      //Take last two attacks
      const [xa, ya] = lastHits[0];
      const [xb, yb] = lastHits[1];

      //if attacks are horizontal:
      if (Math.abs(xa - xb) !== 0) {
        const horizontalMoves = [
          [-1, 0],
          [1, 0],
        ];
        enqueueAdjacent(horizontalMoves, adjacent, attacked, x, y);
      }

      //if attacks are vertical
      if (Math.abs(ya - yb) !== 0) {
        const verticalMoves = [
          [0, -1],
          [0, 1],
        ];
        enqueueAdjacent(verticalMoves, adjacent, attacked, x, y);
      }
    }

    if (lastHits.length < 2) {
      //Enqueue all valid adjacent cells
      const possibleMoves = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      enqueueAdjacent(possibleMoves, adjacent, attacked, x, y);
    }

    //dequeue and attack
    attackFromQueue();
    processAttackRound(humanBoard, human);
    return;
  }
  //Last attack was water and all adjacent cells were tried
  if (!Array.isArray(position) && adjacent.isEmpty()) {
    prevAttack[0] = randomAttack();
    processAttackRound(humanBoard, human);
    return;
  }
  //Last attack was water and there's still adjacent cells to try
  attackFromQueue();
  processAttackRound(humanBoard, human);
}

function randomAttack() {
  let position, positionString;

  //if cell has been attacked, regenerate random position
  do {
    position = [getRandomInt(9, 0), getRandomInt(9, 0)];
    positionString = position.toString();
  } while (attacked.has(positionString));

  attacked.add(positionString);
  human.gameboard.receiveAttack(position);

  return position;
}

function attackFromQueue() {
  const attack = adjacent.dequeue();
  human.gameboard.receiveAttack(attack);
  attacked.add(attack.toString());
  prevAttack[0] = attack;
}

function processAttackRound(playerBoard, player) {
  renderBoard(playerBoard, player, cpu);
  if (player.gameboard.isGameOver()) return gameOver(player);
  switchTurns();
}

function switchTurns() {
  return turn === 'playerOne' ? (turn = 'computer') : (turn = 'playerOne');
}

function gameOver(player) {
  obs.notify('gameOver', player);
  cpuBoard.removeEventListener('click', handlePlayerClicks);
}
