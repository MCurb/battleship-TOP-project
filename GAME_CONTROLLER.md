# Game Controller Implementation

## Overview
The `GameController` class centralized all game flow logic and orchestration for the Battleship game. It removes scattered game state management from the UI layer.

## Key Responsibilities

### Game State Management
- **Phases**: Manages three phases: `setup` → `playing` → `gameOver`
- **Turns**: Tracks whose turn it is (`human` or `cpu`)
- **Winner**: Tracks which player won

### Attack Handling
- `handlePlayerAttack(coordinates)` - Processes human player attacks
- `handleCPUAttack()` - Orchestrates CPU's intelligent attack strategy
- Prevents duplicate attacks via coordinate tracking

### CPU Attack Strategy
- **Random attacks** on first move and after sinking a ship
- **Adjacent search** after hitting a ship
- **Directional following** once two consecutive hits are detected
- Uses a `Queue` for adjacent cell management and `Set` for attack tracking

### Game Flow
- `startGame()` - Transitions from setup to playing phase
- `endGame(winner)` - Ends the game and notifies observers
- `resetGame()` - Resets all state for a new game
- `getGameState()` - Returns current game state snapshot

### UI Updates
- `updateBoardUI()` - Calls renderBoard after each attack
- Works with the observer pattern to update UI elements

## Integration

### In index.js
```javascript
const controller = new GameController(game);

// Start the game when player finishes ship placement
humanRandomBtn.addEventListener('click', () => {
  renderShips(human, humanBoard, humanRandomBtn, cpu);
  controller.startGame();
});

// Handle player clicks on enemy board
cpuBoard.addEventListener('click', (e) => {
  // ... cell validation ...
  controller.handlePlayerAttack([x, y]);
});
```

### Observer Integration
The controller notifies observers of game state changes:
- `'ready'` - When the game transitions to playing phase
- `'gameOver'` - When a player wins (passes the winner)

## Benefits
1. **Centralized Logic** - Game flow is easier to follow and debug
2. **Testable** - Pure methods that don't depend on DOM
3. **Maintainable** - Changes to game rules only affect the controller
4. **Scalable** - Easy to add features like undo, replay, or game saves
5. **Separation of Concerns** - UI layer only handles rendering, not logic
