// ========================
// PUBLIC API (exports)
// ========================

export function renderBoard(playerBoard, player, cpu) {
  playerBoard.innerHTML = '';
  const gridSize = 10;

  //Create rows:
  for (let y = 0; y < gridSize; y++) {
    const row = createRow();
    playerBoard.appendChild(row);

    //Add cells:
    for (let x = 0; x < gridSize; x++) {
      const cell = createCell(x, y);
      row.appendChild(cell);

      //Link cell with gameboard info
      syncBoard(player, cpu, cell, x, y);
    }
  }
}

// ========================
// PRIVATE HELPERS
// ========================

function syncBoard(player, cpu, cell, x, y) {
  if (Array.isArray(player.gameboard.board[x][y])) {
    cell.classList.add('ship', 'attacked-cell');

    if (player.gameboard.board[x][y][0].isSunk()) {
      cell.classList.add('sunk');
    }
  } else if (
    typeof player.gameboard.board[x][y] === 'object' &&
    player !== cpu
  ) {
    cell.classList.add('ship');
  } else if (player.gameboard.board[x][y] === 'attacked') {
    cell.classList.add('attacked-cell');
  }
}

function createRow() {
  const row = document.createElement('div');
  row.classList.add('row');
  return row;
}

function createCell(x, y) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  //x is horizontal, y is vertical
  cell.dataset.cordinates = `${x}${y}`;
  return cell;
}
