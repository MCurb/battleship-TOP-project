class Observable {
  constructor() {
    this.observers = [];
  }

  subscribe(func) {
    this.observers.push(func);
  }

  unsubscribe(func) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  notify(gameState, player) {
    this.observers.forEach((observer) => observer(gameState, player));
  }
}

export const obs = new Observable();
