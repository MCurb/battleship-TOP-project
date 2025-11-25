
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
