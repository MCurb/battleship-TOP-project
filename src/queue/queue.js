export class Queue {
  constructor() {
    this.array = [];
  }

  isEmpty() {
    return this.array.length === 0 ? true : false;
  }

  enqueue(node) {
    this.array.push(node);
  }

  dequeue() {
    return this.array.shift();
  }
}
