import { Ship } from '../ship/ship-class';

export class Gameboard {
  constructor() {
    this.board = [];
  }

  createBoard(gridSize) {
    for (let i = 0; i < gridSize; i++) {
      const row = new Array(gridSize);
      this.board.push(row);
    }
  }

  placeShip(start, end, length) {
    const ship = new Ship(length);

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
}
