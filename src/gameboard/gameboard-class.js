export class Gameboard {
  constructor() {
    this.board = [];
  }

  createBoard(gridSize) {
    for (let i = 0; i < gridSize; i++) {
      const row = [];
      this.board.push(row);
      for (let i = 0; i < gridSize; i++) {
        const cell = 0;
        row.push(cell);
      }
    }
  }
}
