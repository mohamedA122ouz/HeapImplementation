import Graph, { Edge } from "./lib/Graph.ts";
import Dijkstra from "./dikistarAlgo.ts";

Deno.test("Dijkstra - Basic path finding", () => {
    const graph = new Graph();
    graph.AddEdge(1, 2, 4);
    graph.AddEdge(1, 3, 1);
    graph.AddEdge(3, 2, 2);
    graph.AddEdge(2, 4, 5);
    graph.AddEdge(3, 4, 8);

    const dijkstra = new Dijkstra(graph);
    const result = dijkstra.shortestPath(1, 4);

    if (result) {
        console.assert(result.distance === 7, `Expected distance 7, got ${result.distance}`);
        console.assert(result.path.join(" -> ") === "1 -> 3 -> 2 -> 4", `Expected path "1 -> 3 -> 2 -> 4", got ${result.path.join(" -> ")}`);
    } else {
        throw new Error("No path found when one should exist.");
    }
});

Deno.test("Dijkstra - No path available", () => {
    const graph = new Graph();
    graph.AddEdge(1, 2, 3);
    graph.AddEdge(3, 4, 5);

    const dijkstra = new Dijkstra(graph);
    const result = dijkstra.shortestPath(1, 4);

    console.assert(result === null, `Expected no path, but got a result: ${JSON.stringify(result)}`);
});

Deno.test("Dijkstra - Same start and end vertex", () => {
    const graph = new Graph();
    graph.AddEdge(1, 2, 3);
    graph.AddEdge(2, 3, 4);
    graph.AddEdge(3, 4, 5);

    const dijkstra = new Dijkstra(graph);
    const result = dijkstra.shortestPath(1, 1);

    if (result) {
        console.assert(result.distance === 0, `Expected distance 0, got ${result.distance}`);
        console.assert(result.path.length === 1 && result.path[0] === 1, `Expected path "1", got ${result.path.join(" -> ")}`);
    } else {
        throw new Error("Expected a path from vertex to itself, but found none.");
    }
});

Deno.test("Dijkstra - Large weight differences", () => {
    const graph = new Graph();
    graph.AddEdge(1, 2, 100);
    graph.AddEdge(1, 3, 1);
    graph.AddEdge(3, 2, 1);
    graph.AddEdge(2, 4, 1);
    graph.AddEdge(3, 4, 50);

    const dijkstra = new Dijkstra(graph);
    const result = dijkstra.shortestPath(1, 4);

    if (result) {
        console.assert(result.distance === 3, `Expected distance 3, got ${result.distance}`);
        console.assert(result.path.join(" -> ") === "1 -> 3 -> 2 -> 4", `Expected path "1 -> 3 -> 2 -> 4", got ${result.path.join(" -> ")}`);
    } else {
        throw new Error("No path found when one should exist.");
    }
});

Deno.test("Dijkstra - Single edge", () => {
    const graph = new Graph();
    graph.AddEdge(1, 2, 5);

    const dijkstra = new Dijkstra(graph);
    const result = dijkstra.shortestPath(1, 2);

    if (result) {
        console.assert(result.distance === 5, `Expected distance 5, got ${result.distance}`);
        console.assert(result.path.join(" -> ") === "1 -> 2", `Expected path "1 -> 2", got ${result.path.join(" -> ")}`);
    } else {
        throw new Error("No path found when one should exist.");
    }
});
