import { Player } from './player/player-class';

//Create Gameboards

const playerOne = new Player();
const playerTwo = new Player();
playerOne.gameboard.createBoard(10);
playerTwo.gameboard.createBoard(10);

//Render gameboards:
const playerOneBoard = document.querySelector('.player-one-board');
const playerTwoBoard = document.querySelector('.player-two-board');

export function createBoard(gridSize, playerBoard) {
  //Create rows:
  for (let i = 0; i < gridSize; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    playerBoard.appendChild(row);

    //Add cells:
    for (let i = 0; i < gridSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      row.appendChild(cell);
    }
  }
}
createBoard(10, playerOneBoard);
createBoard(10, playerTwoBoard);
