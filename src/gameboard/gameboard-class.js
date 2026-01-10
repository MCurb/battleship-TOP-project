import { Ship } from '../ship/ship-class';

export class Gameboard {
  constructor() {
    this.board = [];
    this.shipsOnBoard = [];
  }

  createBoard(gridSize) {
    for (let i = 0; i < gridSize; i++) {
      const row = new Array(gridSize);
      this.board.push(row);
    }
  }

  cleanBoard() {
    this.board = [];
    this.createBoard(10);
  }

  placeShip(start, end) {
    let [xs, ys] = start;
    const [xe, ye] = end;

    const ship = new Ship(xe - xs + (ye - ys));
    this.shipsOnBoard.push(ship);

    while (xs !== xe || ys !== ye) {
      this.board[xs][ys] = ship;
      if (xs < xe) xs++;
      if (ys < ye) ys++;
    }
  }

  receiveAttack(cordinates) {
    const [x, y] = cordinates;
    const position = this.board[x][y];
    //if it's an already attacked cell
    if (Array.isArray(position) || position === 'attacked') return;

    //if it's an unattacked ship part
    if (typeof position === 'object') {
      position.hit();
      this.board[x][y] = [position, 'attacked'];
      return;
    }

    this.board[x][y] = 'attacked';
  }

  isGameOver() {
    let sunkShips = 0;
    this.shipsOnBoard.forEach((ship) => {
      if (ship.isSunk()) sunkShips++;
    });
    return this.shipsOnBoard.length === sunkShips ? true : false;
  }
}
