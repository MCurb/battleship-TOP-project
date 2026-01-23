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
    gameBoard.placeShip([5, 7], [5, 9]);
    expect(gameBoard.board[5][8]).toBeInstanceOf(Ship);
  });

  test('place multiple ships: horizontal and vertical', () => {
    gameBoard.placeShip([5, 7], [5, 9]);
    gameBoard.placeShip([5, 5], [8, 5]);
    expect(gameBoard.board[5][8]).toBeInstanceOf(Ship);
    expect(gameBoard.board[7][5]).toBeInstanceOf(Ship);
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
  test('attack to the ship is recorded', () => {
    const ship = new Ship(1);
    gameBoard.board[6][7] = ship;
    gameBoard.receiveAttack([6, 7]);

    expect(Array.isArray(gameBoard.board[6][7])).toBe(true);
    expect(gameBoard.board[6][7][0]).toBe(ship);
    expect(gameBoard.board[6][7][1]).toBe('attacked');
  });

  test('attack is recorded just in the ship section that was attacked', () => {
    const ship = new Ship(2);
    gameBoard.board[5][7] = ship;
    gameBoard.board[6][7] = ship;
    gameBoard.receiveAttack([6, 7]);

    expect(Array.isArray(gameBoard.board[5][7])).toBe(false);
  });

  test('attacks to an already attacked cell are dismissed', () => {
    const ship = new Ship(1);
    gameBoard.board[6][7] = ship;
    gameBoard.receiveAttack([6, 7]);

    expect(() => {
      gameBoard.receiveAttack([6, 7]);
    }).not.toThrow();
    expect(gameBoard.board[6][7]).toEqual(expect.any(Array));
  });
});

describe('isGameOver', () => {
  beforeEach(() => {
    gameBoard.createBoard(10);
    gameBoard.placeShip([5, 7], [5, 8]);
    gameBoard.placeShip([6, 7], [6, 8]);
  });
  test('is game over when all ships are sunk', () => {
    gameBoard.receiveAttack([5, 7]);
    gameBoard.receiveAttack([6, 7]);

    expect(gameBoard.isGameOver()).toBe(true);
  });

  test('is NOT game over when there are ships left', () => {
    gameBoard.receiveAttack([5, 7]);
    expect(gameBoard.isGameOver()).toBe(false);
  });
});
