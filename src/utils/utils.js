// Helper functions:

//Enqueue adjacent cells
export function enqueueAdjacent(moves, queue, set, x, y) {
  //Enqueue valid adjacent cells
  for (const [dx, dy] of moves) {
    const move = [x + dx, y + dy];

    if (isValid(move) && !set.has(move.toString())) {
      queue.enqueue(move);
    }
  }
}

//Random number
export function getRandomInt(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Switch turns
export function switchTurns() {
  return turn === 'playerOne' ? (turn = 'computer') : (turn = 'playerOne');
}

//Game over
export function gameOver() {
  alert('Game over bitch');
  playerTwoBoard.removeEventListener('click', handlePlayerClicks);
}

//Is valid move
export function isValid(cordinates) {
  const [x, y] = cordinates;
  return x >= 0 && x < 10 && y >= 0 && y < 10;
}
