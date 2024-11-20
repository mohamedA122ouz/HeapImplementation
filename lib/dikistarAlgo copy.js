import Heap from "./Heap.js";

class Dijkstra {
    //dijkstra algorithm
    graph; //this is to carry the inputted graph
    constructor(graph) {
        this.graph = graph; //intialization
    }

    shortestPath(start, end) {
        let animation = [];
        let table = []; // Store the state of distances and previous for each round
        const distances = new Map(); // Available distances
        const previous = new Map();
        const minHeap = new Heap([], (a, b) => a.distance < b.distance); // MinHeap with priority function
    
        distances.set(start, 0);
        minHeap.enqueue({ vertex: start, distance: 0 });
    
        this.graph.getNeighbors(start)?.forEach(neighbor => {
            // Initialize graph nodes, setting their distances to infinity
            distances.set(neighbor.to, Infinity);
            // Initialize visited nodes with null
            previous.set(neighbor.to, null);
            animation.push({
                node: neighbor.to,
                color: "grey"
            });
        });
    
        // Record the initial table state
        table.push({
            distances: new Map(distances),
            previous: new Map(previous)
        });
    
        while (minHeap.length() > 0) { // Start the algorithm
            // Dequeue the node with the smallest distance
            const { vertex, distance } = minHeap.dequeue();
    
            // Check if it's the target vertex
            if (vertex === end) {
                const path = [];
                let current = end;
                while (current !== null) {
                    path.unshift(current);
                    current = previous.get(current) ?? null;
                }
                return { distance, path, animation, table };
            }
    
            // Process neighbors
            this.graph.getNeighbors(vertex)?.forEach(neighbor => {
                const alt = distance + neighbor.weight;
                if (alt < (distances.get(neighbor.to) ?? Infinity)) {
                    distances.set(neighbor.to, alt);
                    previous.set(neighbor.to, vertex);
                    minHeap.enqueue({ vertex: neighbor.to, distance: alt });
                }
            });
    
            // Record the state after each round
            table.push({
                distances: new Map(distances),
                previous: new Map(previous)
            });
        }
    
        return null;
    }
    


}


export default Dijkstra;
