import { Player } from './player/player-class';
import { Gameboard } from './gameboard/gameboard-class';
import { renderBoard } from './gameboard_ui/gameboard-ui';
import { Ship } from './ship/ship-class';
import { renderShips } from './ship_placement_ui/ship-placement';
import { createBoard } from './game-ui';
import './styles.css';

// INIT
const playerOne = new Player();
const playerTwo = new Player();
playerOne.gameboard.createBoard(10);
playerTwo.gameboard.createBoard(10);
//Query gameboards:
const playerOneBoard = document.querySelector('.player-one-board');
const playerTwoBoard = document.querySelector('.player-two-board');
//Query buttons
const playerRandomShips = document.querySelector('.random-ships.player-one');
const computerRandomShips = document.querySelector('.random-ships.player-two');

//Gameboard
renderBoard(playerOneBoard, playerOne, playerTwo);
renderBoard(playerTwoBoard, playerTwo, playerTwo);

//Ships
renderShips(playerOneBoard, playerOne, playerRandomShips);
renderShips(playerTwoBoard, playerTwo, computerRandomShips);

playerRandomShips.addEventListener('click', () => {
  renderShips(playerOneBoard, playerOne, playerRandomShips);
});
