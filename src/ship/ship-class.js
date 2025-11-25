export class Ship {
  constructor(length) {
    this.length = length;
    this.hitCount = 0;
    this.isShipSunk = false;
  }

  hit() {
    this.hitCount++;
  }

  isSunk() {
    if (this.hitCount >= this.length) {
      this.isShipSunk = true;
      return true;
    }
    return false;
  }
}
