import { Player } from './player/player-class';

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

function computerAttack() {
  if (turn !== 'playerOne') return;
  // if (playerTwo.gameboard.isGameOver) return;

  let position = [getRandomInt(9, 0), getRandomInt(9, 0)];
  let positionString = position.toString();
  while (attacked.has(positionString)) {
    position = [getRandomInt(9, 0), getRandomInt(9, 0)];
    positionString = position.toString();
  }
  attacked.add(positionString);
  const [x, y] = position;
  playerOne.gameboard.receiveAttack([x, y]);
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

function checkCells(player, start, end) {
  let [xs, ys] = start;
  const [xe, ye] = end;

  while (xs !== xe || ys !== ye) {
    if (typeof player.gameboard.board[xs][ys] === 'object') return false;

    if (xs < xe) xs++;
    if (ys < ye) ys++;
  }

  return true;
}
