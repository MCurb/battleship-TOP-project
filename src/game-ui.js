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
      if (typeof player.gameboard.board[i][j] === 'object') {
        cell.classList.add('ship');
      } else if (player.gameboard.board[i][j] === 'attacked') {
        cell.classList.add('attacked-cell');
      }
    }
  }
}
createBoard(10, playerOneBoard, playerOne);
createBoard(10, playerTwoBoard, playerTwo);

playerOneBoard.addEventListener('click', (e) => {
  const cell = e.target;
  if (cell.matches('.cell')) {
    const [x, y] = cell.dataset.cordinates.split('');

    playerOne.gameboard.receiveAttack([Number(x), Number(y)]);
    cell.classList.add('attacked-cell');
  }
});

playerTwoBoard.addEventListener('click', (e) => {
  const cell = e.target;
  if (cell.matches('.cell')) {
    const [x, y] = cell.dataset.cordinates.split('');

    playerTwo.gameboard.receiveAttack([Number(x), Number(y)]);
    cell.classList.add('attacked-cell');
  }
});

//Place Ships:

const randomShipPlayerOne = document.querySelector('.random-ships.player-one');
randomShipPlayerOne.addEventListener('click', () => {
  playerOne.gameboard.placeShip([4, 3], [4, 7], 2);
  randomShipPlayerOne.style.background = 'blue';
  createBoard(10, playerOneBoard, playerOne);
});

//Add more ships, and start working on attacking ships
