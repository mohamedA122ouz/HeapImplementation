"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Heap = /** @class */ (function () {
    function Heap(num, priorityFunc) {
        this.heap = [];
        this.sorted = [];
        this.isSorted = false;
        if (priorityFunc === undefined || priorityFunc === null) {
            this.PriorityFunc = function (n1, n2) { return n1 < n2; };
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
    Heap.prototype.length = function () {
        return this.heap.length;
    };
    Heap.prototype.swap = function (index1, index2) {
        var temp = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = temp;
    };
    Heap.prototype.heapfiy = function (index) {
        var max = index;
        var left = (index * 2) + 1;
        var right = (index * 2) + 2;
        if (left < this.heap.length && this.PriorityFunc(this.heap[left], this.heap[max])) {
            max = left;
        }
        if (right < this.heap.length && this.PriorityFunc(this.heap[right], this.heap[max])) {
            max = right;
        }
        if (max != index) {
            this.swap(max, index);
            this.heapfiy(max);
        }
    };
    Heap.prototype.enqueue = function (el) {
        this.isSorted = false;
        if (el != null)
            this.heap.push(el);
        var n = (Math.floor(this.heap.length / 2) - 1);
        for (var i = n; i >= 0; i--) {
            this.heapfiy(i);
        }
        return true;
    };
    //undefied if the array is empty
    Heap.prototype.dequeue = function () {
        this.swap(0, this.heap.length - 1);
        var out = this.heap.pop();
        this.heapfiy(0);
        return out;
    };
    Heap.prototype.sortedArr = function () {
        var temp = [];
        while (this.heap.length !== 0) {
            temp.push(this.dequeue());
        }
        this.sorted = temp;
        return temp;
    };
    return Heap;
}());
exports.default = Heap;
