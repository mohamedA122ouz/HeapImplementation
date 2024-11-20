class Heap {
    //this comment and code is created by mohamed ahmed azouz
    //heap is a data sturcure base on arrays uses something called complete binary tree
    //it based on this formula to deal with the array
    //______________________________
    // from a father i childs should be
    //{
    // leftChild = (i*2)+1
    // rightChild = (i*2)+2
    //}
    //______________________________
    // from child i 
    //{
    // father = floor(i/2) - 1
    //}
    //______________________________
    //the Running time for the algorithm has O(nlog(n))
    //______________________________
    //
    heap = [];
    sorted = [];
    isSorted = false;
    PriorityFunc;
    length() {
        return this.heap.length;
    }
    //contructor takes arr or object and takes priority function that the heapify 
    //uses to sort the array
    constructor(num, priorityFunc) {
        if (priorityFunc === undefined || priorityFunc === null) {
            this.PriorityFunc = (n1, n2) => n1 < n2;
        }
        else {
            this.PriorityFunc = priorityFunc;
        }
        if (num instanceof Array) {
            this.heap = num;
            this.enqueue(null);
        }
        else
            this.enqueue(num);
    }
    swap(index1, index2) {
        const temp = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = temp;
    }
    //create the the min or the max heap and it has running time of O(log(n))
    heapfiy(index) {
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
            this.heapfiy(max); //this is the cause of the log(n) running time
        }
    }
    //has running time with O(nlog(n)) , as heapify runs in log(n) and it has
    //running time of n/2 then O(n) then O(nlog(n))
    enqueue(el) {
        this.isSorted = false;
        if (el != null)
            this.heap.push(el);
        const n = (Math.floor(this.heap.length / 2) - 1);
        for (let i = n; i >= 0; i--) {
            this.heapfiy(i);
        }
        return true;
    }
    //dequeue function has running time of O(log(n))
    //undefined if the array is empty
    dequeue() {
        this.swap(0, this.heap.length - 1);
        const out = this.heap.pop();
        this.heapfiy(0);
        return out;
    }
    //this has running time of O(nlog(n))
    sortedArr() {
        const temp = [];
        while (this.heap.length !== 0) {
            temp.push(this.dequeue());
        }
        this.sorted = temp;
        return temp;
    }
}
export default Heap;
