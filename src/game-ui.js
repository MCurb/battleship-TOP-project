import { Player } from './player/player-class';
import { Queue } from './queue/queue';

// INIT
const playerOne = new Player();
const playerTwo = new Player();
playerOne.gameboard.createBoard(10);
playerTwo.gameboard.createBoard(10);
//Query gameboards:
const playerOneBoard = document.querySelector('.player-one-board');
const playerTwoBoard = document.querySelector('.player-two-board');
renderBoard(playerOneBoard, playerOne);
renderBoard(playerTwoBoard, playerTwo);

// CREATE GAMEBOARD

export function renderBoard(playerBoard, player) {
  playerBoard.innerHTML = '';
  const gridSize = 10;

  //Create rows:
  for (let y = 0; y < gridSize; y++) {
    const row = createRow();
    playerBoard.appendChild(row);

    //Add cells:
    for (let x = 0; x < gridSize; x++) {
      const cell = createCell(x, y);
      row.appendChild(cell);

      //Link cell with gameboard info
      syncBoard(player, cell, x, y);
    }
  }
}

function syncBoard(player, cell, x, y) {
  if (Array.isArray(player.gameboard.board[x][y])) {
    cell.classList.add('ship', 'attacked-cell');

    if (player.gameboard.board[x][y][0].isSunk()) {
      cell.classList.add('sunk');
    }
  } else if (
    typeof player.gameboard.board[x][y] === 'object' &&
    player !== playerTwo
  ) {
    cell.classList.add('ship');
  } else if (player.gameboard.board[x][y] === 'attacked') {
    cell.classList.add('attacked-cell');
  }
}

function createRow() {
  const row = document.createElement('div');
  row.classList.add('row');
  return row;
}

function createCell(x, y) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  //x is horizontal, y is vertical
  cell.dataset.cordinates = `${x}${y}`;
  return cell;
}

// ATTACKS

// Computer Attacks

let turn = 'computer';
const attacked = new Set();
const prevAttack = [];
const adjacent = new Queue();
const lastHits = [];

function computerAttack() {
  if (turn !== 'playerOne') return;

  //random attack when game starts
  if (prevAttack.length === 0) {
    prevAttack[0] = randomAttack();
    completeRound(playerOneBoard, playerOne);
    return;
  }

  const [x, y] = prevAttack[0];
  const position = playerOne.gameboard.board[x][y];

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
      completeRound(playerOneBoard, playerOne);
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
    completeRound(playerOneBoard, playerOne);
    return;
  }
  //Last attack was water and all adjacent cells were tried
  if (!Array.isArray(position) && adjacent.isEmpty()) {
    prevAttack[0] = randomAttack();
    completeRound(playerOneBoard, playerOne);
    return;
  }
  //Last attack was water and there's still adjacent cells to try
  attackFromQueue();
  completeRound(playerOneBoard, playerOne);
}

function randomAttack() {
  let position, positionString;

  //if cell has been attacked, regenerate random position
  do {
    position = [getRandomInt(9, 0), getRandomInt(9, 0)];
    positionString = position.toString();
  } while (attacked.has(positionString));

  attacked.add(positionString);
  playerOne.gameboard.receiveAttack(position);

  return position;
}

function attackFromQueue() {
  const attack = adjacent.dequeue();
  playerOne.gameboard.receiveAttack(attack);
  attacked.add(attack.toString());
  prevAttack[0] = attack;
}

function completeRound(playerBoard, player) {
  renderBoard(playerBoard, player);
  if (player.gameboard.isGameOver()) return gameOver();
  switchTurns();
}

// User Attacks

playerTwoBoard.addEventListener('click', handlePlayerClicks);

function handlePlayerClicks(e) {
  const cell = e.target;
  if (
    cell.matches('.cell') &&
    turn === 'computer' &&
    !cell.matches('.attacked-cell')
  ) {
    const [x, y] = cell.dataset.cordinates.split('');
    playerTwo.gameboard.receiveAttack([Number(x), Number(y)]);

    completeRound(playerTwoBoard, playerTwo);
    setTimeout(() => {
      computerAttack();
    }, 200);
  }
}

// SHIP PLACEMENT

//Place Ships:

const randomShipPlayerOne = document.querySelector('.random-ships.player-one');
const randomShipPlayerTwo = document.querySelector('.random-ships.player-two');

randomShipPlayerOne.addEventListener('click', () => {
  renderShips(playerOneBoard, playerOne, randomShipPlayerOne);
});

randomShipPlayerTwo.addEventListener('click', () => {
  renderShips(playerTwoBoard, playerTwo, randomShipPlayerTwo);
});

function renderShips(playerBoard, player, button) {
  placeRandomShips(player);

  button.style.background = 'blue';
  renderBoard(playerBoard, player);
}

// Generate Random Ships:

function placeRandomShips(player) {
  //clean board
  player.gameboard.cleanBoard();

  //add ships
  const ships = [
    [1, 4],
    [2, 3],
    [3, 2],
    [4, 1],
  ];

  for (const [quantity, length] of ships) {
    //e.g generate 2 ships, length 3
    for (let i = 0; i < quantity; i++) {
      const { start, end } = generateRandomShip(player, length);
      player.gameboard.placeShip(start, end);
    }
  }
}

function generateRandomShip(player, length) {
  let start;
  let end;
  do {
    const direction = getRandomInt(2, 1);
    const line = getRandomInt(9, 0);
    const from = getRandomInt(10 - length, 0);
    const to = from + length;

    if (direction === 1) {
      //horizontal
      start = [line, from];
      end = [line, to];
    } else {
      //vertical
      start = [from, line];
      end = [to, line];
    }
  } while (!checkCells(player, start, end));

  return { start, end };
}

//Check ship and adjecent cells are free

function checkCells(player, start, end) {
  let [xs, ys] = start;
  const [xe, ye] = end;

  const checked = new Set();
  const queue = new Queue();
  queue.enqueue(start);

  while (xs !== xe || ys !== ye) {
    if (typeof player.gameboard.board[xs][ys] === 'object') return false;

    //Enqueue all valid adjacent cells
    const adjCellMoves = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
      [1, 1],
    ];
    enqueueAdjacent(adjCellMoves, queue, checked, xs, ys);

    //Check all adjacent cells
    while (!queue.isEmpty()) {
      const [x, y] = queue.dequeue();

      if (typeof player.gameboard.board[x][y] === 'object') return false;
      checked.add([x, y].toString());
    }

    //Go to the next cell in the range
    if (xs < xe) xs++;
    if (ys < ye) ys++;
  }

  return true;
}

// Helper functions:

//Enqueue adjacent cells
function enqueueAdjacent(moves, queue, set, x, y) {
  //Enqueue valid adjacent cells
  for (const [dx, dy] of moves) {
    const move = [x + dx, y + dy];

    if (isValid(move) && !set.has(move.toString())) {
      queue.enqueue(move);
    }
  }
}

//Random number
function getRandomInt(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Switch turns
function switchTurns() {
  return turn === 'playerOne' ? (turn = 'computer') : (turn = 'playerOne');
}

//Game over
function gameOver() {
  alert('Game over bitch');
  playerTwoBoard.removeEventListener('click', handlePlayerClicks);
}

//Is valid move
function isValid(cordinates) {
  const [x, y] = cordinates;
  return x >= 0 && x < 10 && y >= 0 && y < 10;
}
