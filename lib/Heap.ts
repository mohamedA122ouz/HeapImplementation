class Heap<T> {
    private heap: T[] = [];
    private sorted: T[] = [];
    private isSorted: boolean = false;
    // from father i
    //{
    // leftChild = (i*2)+1
    // rightChild = (i*2)+2
    //}
    // from child i
    //{
    // father = floor(i/2) - 1
    // rightChild = (i*2)+2
    //}
    PriorityFunc: (n1: T, n2: T) => boolean;
    length(): number {
        return this.heap.length;
    }
    constructor(num: T | T[], priorityFunc?: (n1: T, n2: T) => boolean) {
        if (priorityFunc === undefined || priorityFunc === null) {
            this.PriorityFunc = (n1, n2) => n1 < n2;
        } else {
            this.PriorityFunc = priorityFunc;
        }
        if (num instanceof Array) {
            this.heap = num;
            this.enqueue(null);
        } else
            this.enqueue(num);
    }
    private swap(index1: number, index2: number) {
        const temp: T = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = temp;
    }
    private heapfiy(index: number) {
        let max = index;
        const left = (index * 2) + 1;
        const right = (index * 2) + 2;
        if (left < this.heap.length && this.PriorityFunc(this.heap[left], this.heap[max])) {
            max = left;
        }
        if (right < this.heap.length && this.PriorityFunc(this.heap[right], this.heap[max])) {
            max = right;
        }
        if (max != index) {
            this.swap(max, index);
            this.heapfiy(max)
        }
    }
    enqueue(el: T | null): boolean {
        this.isSorted = false;
        if (el != null)
            this.heap.push(el);
        const n: number = (Math.floor(this.heap.length / 2) - 1);
        for (let i = n; i >= 0; i--) {
            this.heapfiy(i);
        }
        return true;
    }
    //undefied if the array is empty
    dequeue(): T | undefined {
        this.swap(0, this.heap.length - 1);
        const out: T | undefined = this.heap.pop();
        this.heapfiy(0)
        return out;
    }
    sortedArr(): T[] {
        const temp: T[] = [];
        while (this.heap.length !== 0) {
            temp.push(this.dequeue()!);
        }
        this.sorted = temp;
        return temp;
    }
}
export default Heap;
