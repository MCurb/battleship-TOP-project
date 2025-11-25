import { experiments } from 'webpack';
import { Ship } from './ship-class';

let ship;
beforeEach(() => {
  ship = new Ship(6);
});

test('hit method', () => {
  ship.hit();
  expect(ship.hitCount).toBe(1);
});

describe('isSunk method', () => {
  test('no hits yet', () => {
    expect(ship.isSunk()).toBe(false);
  });

  test('being hitted', () => {
    for (let i = 0; i <= ship.length; i++) {
      ship.hit();
    }
    expect(ship.isSunk()).toBe(true);
  });
});
