import Heap from "./Heap.js";

class Dijkstra {
    //dijkstra algorithm
    graph; //this is to carry the inputted graph
    constructor(graph) {
        this.graph = graph; // initialization
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
    
            // Mark the current node as being processed (yellow)
            animation.push({
                node: vertex,
                color: "yellow"
            });
    
            // Check if it's the target vertex
            if (vertex === end) {
                const path = [];
                let current = end;
                while (current !== null) {
                    path.unshift(current);
                    current = previous.get(current) ?? null;
                }

                // Mark the target node as finalized (green)
                animation.push({
                    node: end,
                    color: "green"
                });

                // Push edges for the path in red (final path)
                for (let i = 1; i < path.length; i++) {
                    // Color the edge of the path
                    animation.push({
                        edge: [path[i - 1], path[i]],
                        color: "red"
                    });

                    // Color the node of the path (from start to end)
                    animation.push({
                        node: path[i],
                        color: "red"
                    });
                }

                // Mark the start node as part of the final path (red)
                animation.push({
                    node: start,
                    color: "red"
                });

                return { distance, path, animation, table };
            }
    
            // Process neighbors
            this.graph.getNeighbors(vertex)?.forEach(neighbor => {
                const alt = distance + neighbor.weight;

                // Push the edge being evaluated (yellow)
                animation.push({
                    edge: [vertex, neighbor.to],
                    color: "yellow"
                });

                if (alt < (distances.get(neighbor.to) ?? Infinity)) {
                    distances.set(neighbor.to, alt);
                    previous.set(neighbor.to, vertex);
                    minHeap.enqueue({ vertex: neighbor.to, distance: alt });

                    // Push edge for the updated neighbor (green)
                    animation.push({
                        edge: [vertex, neighbor.to],
                        color: "green"
                    });

                    // Mark the neighbor as discovered (grey)
                    animation.push({
                        node: neighbor.to,
                        color: "grey"
                    });
                } else {
                    // Push edge that wasn't updated (grey)
                    animation.push({
                        edge: [vertex, neighbor.to],
                        color: "grey"
                    });
                }
            });

            // Mark the current node as finalized (green)
            animation.push({
                node: vertex,
                color: "green"
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
