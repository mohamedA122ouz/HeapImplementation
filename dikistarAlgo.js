"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Heap_ts_1 = require("./lib/Heap.js");
var Dijkstra = /** @class */ (function () {
    function Dijkstra(graph) {
        this.graph = graph;
    }
    Dijkstra.prototype.shortestPath = function (start, end) {
        var _a, _b, _c;
        var distances = new Map();
        var previous = new Map();
        var minHeap = new Heap_ts_1.default([], function (a, b) { return a.distance < b.distance; });
        distances.set(start, 0);
        minHeap.enqueue({ vertex: start, distance: 0 });
        (_a = this.graph.getNeighbors(start)) === null || _a === void 0 ? void 0 : _a.forEach(function (neighbor) {
            distances.set(neighbor.to, Infinity);
            previous.set(neighbor.to, null);
        });
        var _loop_1 = function () {
            var _d = minHeap.dequeue(), vertex = _d.vertex, distance = _d.distance;
            if (vertex === end) {
                var path = [];
                var current = end;
                while (current !== null) {
                    path.unshift(current);
                    current = (_b = previous.get(current)) !== null && _b !== void 0 ? _b : null;
                }
                return { value: { distance: distance, path: path } };
            }
            (_c = this_1.graph.getNeighbors(vertex)) === null || _c === void 0 ? void 0 : _c.forEach(function (neighbor) {
                var _a;
                var alt = distance + neighbor.weight;
                if (alt < ((_a = distances.get(neighbor.to)) !== null && _a !== void 0 ? _a : Infinity)) {
                    distances.set(neighbor.to, alt);
                    previous.set(neighbor.to, vertex);
                    minHeap.enqueue({ vertex: neighbor.to, distance: alt });
                }
            });
        };
        var this_1 = this;
        while (minHeap.length() > 0) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return null;
    };
    return Dijkstra;
}());
exports.default = Dijkstra;
