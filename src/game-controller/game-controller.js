import { Queue } from '../queue/queue';
import { obs } from '../observer/observable';
import { getRandomInt, enqueueAdjacent } from '../utils/utils';
import { renderBoard } from '../gameboard_ui/gameboard-ui';

export class GameController {
  constructor(game) {
    this.game = game;
    this.human = game.players.human;
    this.cpu = game.players.cpu;
    this.humanBoard = game.boards.human;
    this.cpuBoard = game.boards.cpu;

    // Game state
    this.currentPhase = 'setup'; // 'setup' | 'playing' | 'gameOver'
    this.turn = null; // 'human' | 'cpu' - set when setup completes
    this.gameWinner = null;

    // CPU attack tracking
    this.attacked = new Set();
    this.adjacent = new Queue();
    this.prevAttack = [];
    this.lastHits = [];
  }

  //Transition from setup phase to playing phase
  startGame() {
    if (this.currentPhase !== 'setup') {
      console.warn('Game already started');
      return;
    }

    this.currentPhase = 'playing';
    this.turn = 'human';
    this.human.gameboard.isGameActive = true;
    this.cpu.gameboard.isGameActive = true;

    obs.notify(this.currentPhase);
  }

  //Human Attack
  handlePlayerAttack(coordinates) {
    if (this.currentPhase !== 'playing' || this.turn !== 'human') return;

    // Process the attack
    this.cpu.gameboard.receiveAttack(coordinates);
    this.updateBoardUI(this.cpuBoard, this.cpu);

    // Check if CPU is defeated
    if (this.cpu.gameboard.isGameOver()) return this.endGame('human');

    // Switch turn to CPU with slight delay
    this.switchTurns();
    setTimeout(() => this.handleCPUAttack(), 200);
  }

  //CPU Attack
  handleCPUAttack() {
    if (this.currentPhase !== 'playing' || this.turn !== 'cpu') return;

    //random attack when game starts
    if (this.prevAttack.length === 0) {
      this.prevAttack[0] = this.getRandomAttack();
      this.processAttackRound(this.humanBoard, this.human);
      return;
    }

    const [x, y] = this.prevAttack[0];
    const position = this.human.gameboard.board[x][y];

    //If prev attack was a hit
    if (Array.isArray(position)) {
      this.lastHits.push(this.prevAttack[0]);

      //Keep lastHits max length = 2
      if (this.lastHits.length > 2) {
        this.lastHits.shift();
      }

      //If the ship was sunk start again with random attacks
      if (position[0].isSunk()) {
        this.prevAttack[0] = this.getRandomAttack();
        this.adjacent.cleanQueue();
        this.lastHits.length = 0;
        this.processAttackRound(this.humanBoard, this.human);
        return;
      }

      if (this.lastHits.length === 2) {
        this.enqueueDirectionalAttacks(x, y);
      }

      if (this.lastHits.length < 2) {
        //Enqueue all valid adjacent cells
        const possibleMoves = [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ];
        enqueueAdjacent(possibleMoves, this.adjacent, this.attacked, x, y);
      }

      //dequeue and attack
      this.attackFromQueue();
      this.processAttackRound(this.humanBoard, this.human);
      return;
    }
    //Last attack was water and all adjacent cells were tried
    if (!Array.isArray(position) && this.adjacent.isEmpty()) {
      this.prevAttack[0] = this.getRandomAttack();
      this.processAttackRound(this.humanBoard, this.human);
      return;
    }
    //Last attack was water and there's still adjacent cells to try
    this.attackFromQueue();
    this.processAttackRound(this.humanBoard, this.human);
  }

  // ========================
  // PRIVATE HELPERS
  // ========================

  getRandomAttack() {
    let x, y, key;
    do {
      x = getRandomInt(0, 9);
      y = getRandomInt(0, 9);
      key = `${x},${y}`;
    } while (this.attacked.has(key));

    this.attacked.add(key);
    this.human.gameboard.receiveAttack([x, y]);
    return [x, y];
  }

  attackFromQueue() {
    const attack = this.adjacent.dequeue();
    this.human.gameboard.receiveAttack(attack);
    this.attacked.add(attack.toString());
    this.prevAttack[0] = attack;
  }

  enqueueDirectionalAttacks(x, y) {
    //Take last two attacks
    const [xa, ya] = this.lastHits[0];
    const [xb, yb] = this.lastHits[1];
    //if attacks are horizontal:
    if (Math.abs(xa - xb) !== 0) {
      const horizontalMoves = [
        [-1, 0],
        [1, 0],
      ];
      enqueueAdjacent(horizontalMoves, this.adjacent, this.attacked, x, y);
    }

    //if attacks are vertical
    if (Math.abs(ya - yb) !== 0) {
      const verticalMoves = [
        [0, -1],
        [0, 1],
      ];
      enqueueAdjacent(verticalMoves, this.adjacent, this.attacked, x, y);
    }
  }

  processAttackRound(playerBoard) {
    this.updateBoardUI(playerBoard, this.human);
    if (this.human.gameboard.isGameOver()) return this.endGame('cpu');
    this.switchTurns();
  }

  updateBoardUI(boardElement, player) {
    renderBoard(boardElement, player, this.cpu);
  }

  switchTurns() {
    this.turn === 'human' ? (this.turn = 'cpu') : (this.turn = 'human');
  }

  //Reset the game for a new round
  resetGame() {
    this.human.gameboard.resetGameboard();
    this.cpu.gameboard.resetGameboard();

    this.currentPhase = 'setup';
    this.currentTurn = null;
    this.gameWinner = null;

    // Reset CPU attack tracking
    this.attacked.clear();
    this.adjacent.cleanQueue();
    this.prevAttack = [];
    this.lastHits = [];

    obs.notify(this.currentPhase);
  }

  //End the game and notify observers
  endGame(winner) {
    this.currentPhase = 'gameOver';
    this.gameWinner = winner;
    const winnerPlayer = winner === 'human' ? this.human : this.cpu;
    obs.notify(this.currentPhase, winnerPlayer);
  }
}
