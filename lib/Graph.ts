//import Pir
class Edge {

  constructor(from_arg: number, to_arg: number, weight_arg: number) {
    this.from = from_arg;
    this.to = to_arg;
    this.weight = weight_arg;
  }
  from: number;
  to: number;
  weight: number;
}

class Graph {
  private Adjacny_list: Map<number, Edge[]>;
  constructor() {
    this.Adjacny_list = new Map<number, Edge[]>;
  }

  public Add_vertex(Vertex: number): boolean {
    if (!this.Adjacny_list.has(Vertex)) {
      this.Adjacny_list.set(Vertex, []);
      return true;
    }
    return false;
  }
  public AddEdge(source: number, dest: number, weight: number) {

    if (!this.Adjacny_list.has(source)) {
      this.Add_vertex(source);
    }
    if (!this.Adjacny_list.has(dest)) {
      this.Add_vertex(dest);
    }

    // adding new Edge;
    const edge: Edge = new Edge(source, dest, weight);
    const edge2: Edge = new Edge(dest, source, weight);


    this.Adjacny_list.get(source)?.push(edge);
    this.Adjacny_list.get(dest)?.push(edge2);
  }
  public getNeighbors(Vertex: number): Edge[] | undefined {
    return this.Adjacny_list.get(Vertex);
  }
  public Compare (g1:Edge,g2:Edge):boolean
  {
    if(g1.weight>g2.weight)
    {
        return true;
    }
    return false;
  }
}
export default Graph;
export {Edge};