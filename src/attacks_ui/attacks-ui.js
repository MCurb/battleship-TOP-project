// ATTACKS

// Computer Attacks

let turn = 'computer';
const attacked = new Set();
const prevAttack = [];
const adjacent = new Queue();
const lastHits = [];

function computerAttack() {
  if (turn !== 'playerOne') return;

  //random attack when game starts
  if (prevAttack.length === 0) {
    prevAttack[0] = randomAttack();
    completeRound(playerOneBoard, playerOne);
    return;
  }

  const [x, y] = prevAttack[0];
  const position = playerOne.gameboard.board[x][y];

  //If prev attack was a hit
  if (Array.isArray(position)) {
    lastHits.push(prevAttack[0]);

    //Keep lastHits max length = 2
    if (lastHits.length > 2) {
      lastHits.shift();
    }

    //If the ship was sunk start again with random attacks
    if (position[0].isSunk()) {
      prevAttack[0] = randomAttack();
      adjacent.cleanQueue();
      lastHits.length = 0;
      completeRound(playerOneBoard, playerOne);
      return;
    }

    if (lastHits.length === 2) {
      //Take last two attacks
      const [xa, ya] = lastHits[0];
      const [xb, yb] = lastHits[1];

      //if attacks are horizontal:
      if (Math.abs(xa - xb) !== 0) {
        const horizontalMoves = [
          [-1, 0],
          [1, 0],
        ];
        enqueueAdjacent(horizontalMoves, adjacent, attacked, x, y);
      }

      //if attacks are vertical
      if (Math.abs(ya - yb) !== 0) {
        const verticalMoves = [
          [0, -1],
          [0, 1],
        ];
        enqueueAdjacent(verticalMoves, adjacent, attacked, x, y);
      }
    }

    if (lastHits.length < 2) {
      //Enqueue all valid adjacent cells
      const possibleMoves = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      enqueueAdjacent(possibleMoves, adjacent, attacked, x, y);
    }

    //dequeue and attack
    attackFromQueue();
    completeRound(playerOneBoard, playerOne);
    return;
  }
  //Last attack was water and all adjacent cells were tried
  if (!Array.isArray(position) && adjacent.isEmpty()) {
    prevAttack[0] = randomAttack();
    completeRound(playerOneBoard, playerOne);
    return;
  }
  //Last attack was water and there's still adjacent cells to try
  attackFromQueue();
  completeRound(playerOneBoard, playerOne);
}

function randomAttack() {
  let position, positionString;

  //if cell has been attacked, regenerate random position
  do {
    position = [getRandomInt(9, 0), getRandomInt(9, 0)];
    positionString = position.toString();
  } while (attacked.has(positionString));

  attacked.add(positionString);
  playerOne.gameboard.receiveAttack(position);

  return position;
}

function attackFromQueue() {
  const attack = adjacent.dequeue();
  playerOne.gameboard.receiveAttack(attack);
  attacked.add(attack.toString());
  prevAttack[0] = attack;
}

function completeRound(playerBoard, player) {
  renderBoard(playerBoard, player);
  if (player.gameboard.isGameOver()) return gameOver();
  switchTurns();
}

// User Attacks

playerTwoBoard.addEventListener('click', handlePlayerClicks);

function handlePlayerClicks(e) {
  const cell = e.target;
  if (
    cell.matches('.cell') &&
    turn === 'computer' &&
    !cell.matches('.attacked-cell')
  ) {
    const [x, y] = cell.dataset.cordinates.split('');
    playerTwo.gameboard.receiveAttack([Number(x), Number(y)]);

    completeRound(playerTwoBoard, playerTwo);
    setTimeout(() => {
      computerAttack();
    }, 200);
  }
}