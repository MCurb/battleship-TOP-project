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

  placeShip(start, end, length) {
    const ship = new Ship(length);
    this.shipsOnBoard.push(ship);
    let [xs, ys] = start;
    const [xe, ye] = end;
    while (xs !== xe || ys !== ye) {
      this.board[xs][ys] = ship;
      if (xs < xe) xs++;
      if (xs > xe) xs--;
      if (ys < ye) ys++;
      if (ys > ye) ys--;
    }
    //I need to check if a ship is already there, to avoid adding one ship
    //over the other
  }

  receiveAttack(cordinates) {
    const [x, y] = cordinates;
    const position = this.board[x][y];

    if (typeof position === 'object') {
      position.hit();
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
