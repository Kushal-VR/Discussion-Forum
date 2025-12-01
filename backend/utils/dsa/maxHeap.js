// Reusable Max-Heap (priority queue) implementation for Questions
// Comparison is provided via a comparator function.

class MaxHeap {
  /**
   * @param {(a: any, b: any) => number} compareFn
   */
  constructor(compareFn) {
    this.heap = [];
    this.compare =
      compareFn ||
      ((a, b) => {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
      });
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    return this.heap[0] || null;
  }

  push(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  pop() {
    if (this.isEmpty()) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return max;
  }

  heapifyUp(index) {
    let currentIndex = index;
    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      if (
        this.compare(this.heap[currentIndex], this.heap[parentIndex]) <= 0
      ) {
        break;
      }
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
    }
  }

  heapifyDown(index) {
    let currentIndex = index;
    const length = this.heap.length;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const leftIndex = 2 * currentIndex + 1;
      const rightIndex = 2 * currentIndex + 2;
      let largest = currentIndex;

      if (
        leftIndex < length &&
        this.compare(this.heap[leftIndex], this.heap[largest]) > 0
      ) {
        largest = leftIndex;
      }

      if (
        rightIndex < length &&
        this.compare(this.heap[rightIndex], this.heap[largest]) > 0
      ) {
        largest = rightIndex;
      }

      if (largest === currentIndex) break;

      this.swap(currentIndex, largest);
      currentIndex = largest;
    }
  }

  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}

export default MaxHeap;


