import { Ship } from './ship-class';

let ship;
beforeEach(() => {
  ship = new Ship(3);
});

describe('hit method', () => {
  test('one hit', () => {
    ship.hit();
    expect(ship.hitCount).toBe(1);
  });

  test('multiple hits', () => {
    ship.hit();
    ship.hit();
    expect(ship.hitCount).toBe(2);
  });

  test('hit and sink', () => {
    ship.hit();
    ship.hit();
    ship.hit();

    expect(ship.isShipSunk).toBe(true);
  })
});

describe('isSunk method', () => {
  test('no hits yet', () => {
    expect(ship.isSunk()).toBe(false);
  });

  test('being hitted', () => {
    ship.hitCount = ship.length;
    expect(ship.isSunk()).toBe(true);
  });
});
