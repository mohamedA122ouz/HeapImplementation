class Edge {
    constructor(from_arg, to_arg, weight_arg) {
        this.from = from_arg;
        this.to = to_arg;
        this.weight = weight_arg;
    }
    from;
    to;
    weight;
}
class Graph {
    Adjacny_list;
    constructor() {
        this.Adjacny_list = new Map;
    }
    Add_vertex(Vertex) {
        if (!this.Adjacny_list.has(Vertex)) {
            this.Adjacny_list.set(Vertex, []);
            return true;
        }
        return false;
    }
    AddEdge(source, dest, weight) {
        if (!this.Adjacny_list.has(source)) {
            this.Add_vertex(source);
        }
        if (!this.Adjacny_list.has(dest)) {
            this.Add_vertex(dest);
        }
        // adding new Edge;
        const edge = new Edge(source, dest, weight);
        const edge2 = new Edge(dest, source, weight);
        this.Adjacny_list.get(source)?.push(edge);
        this.Adjacny_list.get(dest)?.push(edge2);
    }
    getNeighbors(Vertex) {
        return this.Adjacny_list.get(Vertex);
    }
    Compare(g1, g2) {
        if (g1.weight > g2.weight) {
            return true;
        }
        return false;
    }
}
export default Graph;
export { Edge };
