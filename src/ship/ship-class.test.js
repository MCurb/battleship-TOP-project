import { Ship } from './ship-class';

let ship;
beforeEach(() => {
  ship = new Ship(6);
});

test('hit method', () => {
  ship.hit();
  expect(ship.hitCount).toBe(1);
});
