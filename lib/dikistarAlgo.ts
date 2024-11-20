import Graph, { Edge } from "./Graph.ts";
import Heap from "./Heap.ts";
//class Dijkstra
class Dijkstra {
    //dijkstra algorithm
    private graph: Graph;//this is to carry the inputted graph
    constructor(graph: Graph) {
        this.graph = graph;//intialization
    }
    public shortestPath(start: number, end: number): { distance: number, path: number[] } | null {
        const distances: Map<number, number> = new Map();//available distances
        const previous: Map<number, number | null> = new Map();
        const minHeap = new Heap<{ vertex: number, distance: number }>(
            [],
            (a, b) => a.distance > b.distance//priority function to create (minHeap)
        );//this datastructure is documented withing the code it self in side lib
        distances.set(start, 0);
        minHeap.enqueue({ vertex: start, distance: 0 });
        this.graph.getNeighbors(start)?.forEach(neighbor => {
            //coping the graph nodes setting it's distances to infinity
            distances.set(neighbor.to, Infinity);
            //setting visited node with null
            previous.set(neighbor.to, null);
        });
        while (minHeap.length() > 0) {//starting the algo
            const { vertex, distance } = minHeap.dequeue()!;//deqeueuing the first node
            if (vertex === end) {//check if it the final vertix
                const path: number[] = [];
                let current: number | null = end;
                while (current !== null) {
                    path.unshift(current);
                    current = previous.get(current) ?? null;
                }
                return { distance, path };
            }
            this.graph.getNeighbors(vertex)?.forEach(neighbor => {
                const alt = distance + neighbor.weight;
                if (alt < (distances.get(neighbor.to) ?? Infinity)) {
                    distances.set(neighbor.to, alt);
                    previous.set(neighbor.to, vertex);
                    console.log(neighbor);
                    minHeap.enqueue({ vertex: neighbor.to, distance: alt });
                }
            });
        }
        return null;
    }
}

export default Dijkstra;
