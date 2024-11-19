"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Edge = void 0;
//import Pir
var Edge = /** @class */ (function () {
    function Edge(from_arg, to_arg, weight_arg) {
        this.from = from_arg;
        this.to = to_arg;
        this.weight = weight_arg;
    }
    return Edge;
}());
exports.Edge = Edge;
var Graph = /** @class */ (function () {
    function Graph() {
        this.Adjacny_list = new Map;
    }
    Graph.prototype.Add_vertex = function (Vertex) {
        if (!this.Adjacny_list.has(Vertex)) {
            this.Adjacny_list.set(Vertex, []);
            return true;
        }
        return false;
    };
    Graph.prototype.AddEdge = function (source, dest, weight) {
        var _a, _b;
        if (!this.Adjacny_list.has(source)) {
            this.Add_vertex(source);
        }
        if (!this.Adjacny_list.has(dest)) {
            this.Add_vertex(dest);
        }
        // adding new Edge;
        var edge = new Edge(source, dest, weight);
        var edge2 = new Edge(dest, source, weight);
        (_a = this.Adjacny_list.get(source)) === null || _a === void 0 ? void 0 : _a.push(edge);
        (_b = this.Adjacny_list.get(dest)) === null || _b === void 0 ? void 0 : _b.push(edge2);
    };
    Graph.prototype.getNeighbors = function (Vertex) {
        return this.Adjacny_list.get(Vertex);
    };
    Graph.prototype.Compare = function (g1, g2) {
        if (g1.weight > g2.weight) {
            return true;
        }
        return false;
    };
    return Graph;
}());
exports.default = Graph;
