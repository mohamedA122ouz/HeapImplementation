import Graph, { Edge } from "./lib/Graph.ts";
import Heap from "./lib/Heap.ts";
//class Dijkstra
class Dijkstra {
    //
    private graph: Graph;
    constructor(graph: Graph) {
        this.graph = graph;
    }
    public shortestPath(start: number, end: number): { distance: number, path: number[] } | null {
        const distances: Map<number, number> = new Map();
        const previous: Map<number, number | null> = new Map();
        const minHeap = new Heap<{ vertex: number, distance: number }>(
            [],
            (a, b) => a.distance < b.distance
        );
        distances.set(start, 0);
        minHeap.enqueue({ vertex: start, distance: 0 });
        this.graph.getNeighbors(start)?.forEach(neighbor => {
            distances.set(neighbor.to, Infinity);
            previous.set(neighbor.to, null);
        });
        while (minHeap.length() > 0) {
            const { vertex, distance } = minHeap.dequeue()!;
            if (vertex === end) {
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
                    minHeap.enqueue({ vertex: neighbor.to, distance: alt });
                }
            });
        }
        return null;
    }
}

export default Dijkstra;
