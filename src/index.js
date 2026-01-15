import { Player } from './player/player-class';
import { Gameboard } from './gameboard/gameboard-class';
import { renderBoard } from './gameboard_ui/gameboard-ui';
import { Ship } from './ship/ship-class';
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

//Gameboard
renderBoard(playerOneBoard, playerOne, playerTwo);
renderBoard(playerTwoBoard, playerTwo, playerTwo);

//Ships
renderShips(playerOneBoard, playerOne, randomShipPlayerOne);
renderShips(playerTwoBoard, playerTwo, randomShipPlayerTwo);
