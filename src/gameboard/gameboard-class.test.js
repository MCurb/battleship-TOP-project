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
