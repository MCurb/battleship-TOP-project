import { Player } from './player/player-class';

//Create Gameboards

const playerOne = new Player();
const playerTwo = new Player();
playerOne.gameboard.createBoard(10);
playerTwo.gameboard.createBoard(10);

//Render gameboards:
const playerOneBoard = document.querySelector('.player-one-board');
const playerTwoBoard = document.querySelector('.player-two-board');

export function createBoard(gridSize, playerBoard, player) {
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
createBoard(10, playerOneBoard, playerOne);
createBoard(10, playerTwoBoard, playerTwo);

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

playerOneBoard.addEventListener('click', (e) => {
  const cell = e.target;
  if (cell.matches('.cell') && turn === 'playerOne') {
    const [x, y] = cell.dataset.cordinates.split('');

    playerOne.gameboard.receiveAttack([Number(x), Number(y)]);
    cell.classList.add('attacked-cell');
    createBoard(10, playerOneBoard, playerOne);
    switchTurns();
  }
});

playerTwoBoard.addEventListener('click', (e) => {
  const cell = e.target;
  if (cell.matches('.cell') && turn === 'computer') {
    const [x, y] = cell.dataset.cordinates.split('');

    playerTwo.gameboard.receiveAttack([Number(x), Number(y)]);
    cell.classList.add('attacked-cell');
    createBoard(10, playerTwoBoard, playerTwo);
    switchTurns();
  }
});

//Place Ships:

const randomShipPlayerOne = document.querySelector('.random-ships.player-one');
const randomShipPlayerTwo = document.querySelector('.random-ships.player-two');

randomShipPlayerOne.addEventListener('click', () => {
  playerOne.gameboard.placeShip([1, 3], [1, 4]);
  playerOne.gameboard.placeShip([6, 3], [9, 3]);
  playerOne.gameboard.placeShip([3, 3], [3, 8]);

  randomShipPlayerOne.style.background = 'blue';
  createBoard(10, playerOneBoard, playerOne);
});

randomShipPlayerTwo.addEventListener('click', () => {
  playerTwo.gameboard.placeShip([1, 6], [1, 7]);
  playerTwo.gameboard.placeShip([8, 5], [8, 9]);
  playerTwo.gameboard.placeShip([3, 3], [3, 8]);

  randomShipPlayerTwo.style.background = 'blue';
  createBoard(10, playerTwoBoard, playerTwo);
});

// Switch turns

function switchTurns() {
  return turn === 'playerOne' ? (turn = 'computer') : (turn = 'playerOne');
}
