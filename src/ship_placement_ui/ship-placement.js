import { renderBoard } from '../gameboard_ui/gameboard-ui';
import { getRandomInt, enqueueAdjacent } from '../utils/utils';
import { Queue } from '../queue/queue';

// ========================
// PUBLIC API (exports)
// ========================

//Render Ships:

export function renderShips(player, playerBoard, opponentPlayer) {
  if (player.gameboard.isGameActive) return;
  placeRandomShips(player);

  renderBoard(playerBoard, player, opponentPlayer);
}

// ========================
// PRIVATE HELPERS
// ========================

// Generate Random Ships:

function placeRandomShips(player) {
  //clean board
  player.gameboard.cleanBoard();

  //add ships
  const ships = [
    [1, 4],
    [2, 3],
    [3, 2],
    [4, 1],
  ];

  for (const [quantity, length] of ships) {
    //e.g generate 2 ships, length 3
    for (let i = 0; i < quantity; i++) {
      const { start, end } = generateRandomShip(player, length);
      player.gameboard.placeShip(start, end);
    }
  }
}

function generateRandomShip(player, length) {
  let start;
  let end;
  do {
    const direction = getRandomInt(2, 1);
    const line = getRandomInt(9, 0);
    const from = getRandomInt(10 - length, 0);
    const to = from + length;

    if (direction === 1) {
      //horizontal
      start = [line, from];
      end = [line, to];
    } else {
      //vertical
      start = [from, line];
      end = [to, line];
    }
  } while (!checkCells(player, start, end));

  return { start, end };
}

//Check ship and adjecent cells are free
function checkCells(player, start, end) {
  let [xs, ys] = start;
  const [xe, ye] = end;

  const checked = new Set();
  const queue = new Queue();
  queue.enqueue(start);

  while (xs !== xe || ys !== ye) {
    if (typeof player.gameboard.board[xs][ys] === 'object') return false;

    //Enqueue all valid adjacent cells
    const adjCellMoves = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
      [1, 1],
    ];
    enqueueAdjacent(adjCellMoves, queue, checked, xs, ys);

    //Check all adjacent cells
    while (!queue.isEmpty()) {
      const [x, y] = queue.dequeue();

      if (typeof player.gameboard.board[x][y] === 'object') return false;
      checked.add([x, y].toString());
    }

    //Go to the next cell in the range
    if (xs < xe) xs++;
    if (ys < ye) ys++;
  }

  return true;
}
