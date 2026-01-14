import { Player } from './player/player-class';
import { Queue } from './queue/queue';

//Create Gameboards

const playerOne = new Player();
const playerTwo = new Player();
playerOne.gameboard.createBoard(10);
playerTwo.gameboard.createBoard(10);

//Render gameboards:
const playerOneBoard = document.querySelector('.player-one-board');
const playerTwoBoard = document.querySelector('.player-two-board');

export function renderBoard(gridSize, playerBoard, player) {
  playerBoard.innerHTML = '';
  //Create rows:
  for (let y = 0; y < gridSize; y++) {
    const row = document.createElement('div');
    row.classList.add('row');
    playerBoard.appendChild(row);
    //Add cells:
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      //x is horizontal, y is vertical
      cell.dataset.cordinates = `${x}${y}`;
      row.appendChild(cell);
      //Link the cell with Gameboard information
      syncBoard(player, cell, x, y);
    }
  }
}
renderBoard(10, playerOneBoard, playerOne);
renderBoard(10, playerTwoBoard, playerTwo);

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

//Attack cells

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
    end();
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
      end();
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
        enqueueAdjacent(horizontalMoves, x, y);
      }

      //if attacks are vertical
      if (Math.abs(ya - yb) !== 0) {
        const verticalMoves = [
          [0, -1],
          [0, 1],
        ];
        enqueueAdjacent(verticalMoves, x, y);
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
      enqueueAdjacent(possibleMoves, x, y);
    }

    //dequeue and attack
    attackFromQueue();
    end();
    return;
  }
  //Last attack was water and all adjacent cells were tried
  if (!Array.isArray(position) && adjacent.isEmpty()) {
    prevAttack[0] = randomAttack();
    end();
    return;
  }
  //Last attack was water and there's still adjacent cells to try
  attackFromQueue();
  //End
  end();
}

function randomAttack() {
  let position = [getRandomInt(9, 0), getRandomInt(9, 0)];
  let positionString = position.toString();

  while (attacked.has(positionString)) {
    position = [getRandomInt(9, 0), getRandomInt(9, 0)];
    positionString = position.toString();
  }
  attacked.add(positionString);
  const [x, y] = position;
  playerOne.gameboard.receiveAttack([x, y]);
  return position;
}

function attackFromQueue() {
  const attack = adjacent.dequeue();
  playerOne.gameboard.receiveAttack(attack);
  attacked.add(attack.toString());
  prevAttack[0] = attack;
}

function end() {
  renderBoard(10, playerOneBoard, playerOne);
  if (playerOne.gameboard.isGameOver()) return gameOver();
  switchTurns();
}

function enqueueAdjacent(adj, x, y) {
  //Enqueue valid adjacent cells
  for (const [dx, dy] of adj) {
    const move = [x + dx, y + dy];

    if (isValid(move) && !attacked.has(move.toString())) {
      adjacent.enqueue(move);
    }
  }
}

// playerOneBoard.addEventListener('click', (e) => {
//   const cell = e.target;
//   if (
//     cell.matches('.cell') &&
//     turn === 'playerOne' &&
//     !cell.matches('.attacked-cell')
//   ) {
//     const [x, y] = cell.dataset.cordinates.split('');
//     playerOne.gameboard.receiveAttack([Number(x), Number(y)]);

//     createBoard(10, playerOneBoard, playerOne);
//     switchTurns();
//   }
// });

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

    renderBoard(10, playerTwoBoard, playerTwo);
    if (playerTwo.gameboard.isGameOver()) return gameOver();
    switchTurns();
    setTimeout(() => {
      computerAttack();
    }, 10);
  }
}

//Place Ships:

const randomShipPlayerOne = document.querySelector('.random-ships.player-one');
const randomShipPlayerTwo = document.querySelector('.random-ships.player-two');

randomShipPlayerOne.addEventListener('click', () => {
  playerOne.gameboard.cleanBoard();
  placeRandomShips(playerOne);

  randomShipPlayerOne.style.background = 'blue';
  renderBoard(10, playerOneBoard, playerOne);
});

randomShipPlayerTwo.addEventListener('click', () => {
  playerTwo.gameboard.cleanBoard();
  placeRandomShips(playerTwo);

  randomShipPlayerTwo.style.background = 'blue';
  renderBoard(10, playerTwoBoard, playerTwo);
});

// Helper functions:

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

// Random Ships:

function placeRandomShips(player) {
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

//Check cells are free
//The goal is to do this:
//- Start on the range
//- Enqueue it with all it's adjacent cells that are valid (valid means, not off board)
//loop
//- Check all the cells in the queue untill queue is empty. (return if one of the cells has an object)
//After loop ends, keep going to the next cell in the range

function checkCells(player, start, end) {
  let [xs, ys] = start;
  const [xe, ye] = end;

  const queue = new Queue();
  const checked = new Set();

  //Init
  queue.enqueue(start);

  while (xs !== xe || ys !== ye) {
    if (typeof player.gameboard.board[xs][ys] === 'object') return false;

    //Enqueue all valid adjacent cells
    for (const [dx, dy] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
      [1, 1],
    ]) {
      //Calculate possible adjacent cell
      const move = [xs + dx, ys + dy];

      if (isValid(move) && !checked.has(move.toString())) {
        queue.enqueue(move);
      }
    }

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
