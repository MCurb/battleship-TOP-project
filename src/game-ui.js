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
  for (let i = 0; i < gridSize; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    playerBoard.appendChild(row);
    //Add cells:
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.cordinates = `${i}${j}`;
      row.appendChild(cell);
      //Link the cell with Gameboard information
      syncBoard(player, cell, i, j);
    }
  }
}
renderBoard(10, playerOneBoard, playerOne);
renderBoard(10, playerTwoBoard, playerTwo);

function syncBoard(player, cell, i, j) {
  if (Array.isArray(player.gameboard.board[i][j])) {
    cell.classList.add('ship', 'attacked-cell');

    if (player.gameboard.board[i][j][0].isSunk()) {
      cell.classList.add('sunk');
    }
  } else if (typeof player.gameboard.board[i][j] === 'object') {
    cell.classList.add('ship');
  } else if (player.gameboard.board[i][j] === 'attacked') {
    cell.classList.add('attacked-cell');
  }
}

//Attack cells

let turn = 'computer';
const attacked = new Set();
const lastAttack = [];
const adjacent = new Queue();

function computerAttack() {
  if (turn !== 'playerOne') return;

  //If there's not last attacked position
  if (lastAttack.length === 0) {
    lastAttack[0] = randomAttack();
    end();
    return;
  }
  //take last attack
  const [x, y] = lastAttack[0];
  const position = playerOne.gameboard.board[x][y];
  //If last attack was a ship
  if (Array.isArray(position)) {
    //If the ship was sunk, make a random attack
    if (position[0].isSunk()) {
      lastAttack[0] = randomAttack();
      adjacent.cleanQueue();
      end();
      return;
    }

    //Enqueue valid adjacent cells
    for (const [dx, dy] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      const move = [x + dx, y + dy];

      if (isValid(move) && !attacked.has(move.toString())) {
        adjacent.enqueue(move);
      }
    }
    //dequeue and attack
    const attack = adjacent.dequeue();
    playerOne.gameboard.receiveAttack(attack);
    attacked.add(attack.toString());
    lastAttack[0] = attack;
    end();
    return;
  }
  //If last attack was water and all adjacent cells were tried
  if (!Array.isArray(position) && adjacent.isEmpty()) {
    lastAttack[0] = randomAttack();
    end();
    return;
  }
  //If last attack was water and there's still adjacent cells to try
  //dequeue and attack
  const attack = adjacent.dequeue();
  playerOne.gameboard.receiveAttack(attack);
  attacked.add(attack.toString());
  lastAttack[0] = attack;

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

function end() {
  renderBoard(10, playerOneBoard, playerOne);
  if (playerOne.gameboard.isGameOver()) return gameOver();
  switchTurns();
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
    }, 500);
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
