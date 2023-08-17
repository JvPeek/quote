// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Queue<T = any> {
  private elements: Map<number, T>;
  private head: number;
  private tail: number;

  constructor() {
    this.elements = new Map();
    this.head = 0;
    this.tail = 0;
  }

  enqueue(element: T) {
    this.elements.set(this.tail, element);
    this.tail += 1;
  }

  dequeue() {
    const item = this.elements.get(this.head);
    this.elements.delete(this.head);
    this.head += 1;

    return item;
  }

  peek() {
    return this.elements.get(this.head);
  }

  clear() {
    this.elements.clear();
    this.head = 0;
    this.tail = 0;
  }

  get length() {
    return this.tail - this.head;
  }

  get isEmpty() {
    return this.length === 0;
  }
}
