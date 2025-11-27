import { experiments } from 'webpack';
import { Ship } from '../ship/ship-class';
import { Gameboard } from './gameboard-class';

let gameBoard;
beforeEach(() => {
  gameBoard = new Gameboard();
});

test('board creation', () => {
  const gridSize = 10;
  gameBoard.createBoard(gridSize);

  const boardRows = gameBoard.board.length;
  const boardColumns = gameBoard.board[0].length;

  expect(boardRows).toBe(gridSize);
  expect(boardColumns).toBe(gridSize);
});

describe('ship placement', () => {
  beforeEach(() => {
    gameBoard.createBoard(10);
  });
  test('place one ship', () => {
    gameBoard.placeShip([5, 7], [5, 9], 2);
    expect(typeof gameBoard.board[5][8]).toBe('object');
  });

  test('place multiple ships: horizontal and vertical', () => {
    gameBoard.placeShip([5, 7], [5, 9], 2);
    gameBoard.placeShip([5, 5], [8, 5], 3);
    expect(typeof gameBoard.board[5][8]).toBe('object');
    expect(typeof gameBoard.board[7][5]).toBe('object');
  });

  //Test if placeShip doesn't add a ship over another ship
});

describe('receive attacks', () => {
  beforeEach(() => {
    gameBoard.createBoard(10);
  });
  test('hit ship', () => {
    const ship = new Ship(1);
    gameBoard.board[5][7] = ship;
    gameBoard.receiveAttack([5, 7]);
    expect(ship.hitCount).toBe(1);
  });
  test('multiple hits till sunk', () => {
    const ship = new Ship(2);
    gameBoard.board[5][7] = ship;
    gameBoard.board[6][7] = ship;
    gameBoard.receiveAttack([5, 7]);
    gameBoard.receiveAttack([6, 7]);
    expect(ship.hitCount).toBe(2);
    expect(ship.isShipSunk).toBe(true);
  });
  test('missed shot is recorded', () => {
    gameBoard.receiveAttack([5, 7]);
    expect(gameBoard.board[5][7]).toBe('attacked');
  });
  //I might need to check if an attack over a ship is also recorded on the board
});
