import Heap from "./Heap.js";
//class Dijkstra



// array of animation 
// class Dijkstra {
//     //dijkstra algorithm
//     graph; //this is to carry the inputted graph
//     constructor(graph) {
//         this.graph = graph; //intialization
//     }
//     shortestPath(start, end) {
//         let animation = [] ;
//         const distances = new Map(); 
//         //available distances
//         const previous = new Map();
//         const minHeap = new Heap([], (a, b) => a.distance < b.distance 
//         //priority function to create (minHeap)
//         ); 
//         //this datastructure is documented withing the code it self in side lib
//         distances.set(start, 0);
//         minHeap.enqueue({ vertex: start, distance: 0 });
//         this.graph.getNeighbors(start)?.forEach(neighbor => {
//             //coping the graph nodes setting it's distances to infinity
//             distances.set(neighbor.to, Infinity);
//             //setting visited node with null
//             previous.set(neighbor.to, null);
//             // append array <- change vertex to gray
//             animation.push({
//                 'node':  neighbor.to ,
//                 'color': "grey"
//             }) ;
//         });
//         //starting the algo
//         while (minHeap.length() > 0) { 
//             const { vertex, distance } = minHeap.dequeue();
//             // last statement in the code   
//             animation.push({
//                 'node':  vertex ,
//                 'color': "pink"
//             }) ;        
//             if (vertex === end) { 
//                 //check if it the final vertex
//                 const path = [];
//                 let current = end;
//                 while (current !== null) {
//                     path.unshift(current);
//                     current = previous.get(current) ?? null;
//                 }
//                 return { distance, path , animation};
//             }
//             // compares edges
//             this.graph.getNeighbors(vertex)?.forEach(neighbor => {
//                 //alt is the know distant to reach this point so far
//                 const alt = distance + neighbor.weight;
//                 animation.push({
//                     'node':  neighbor.from ,
//                     'color': "grey"
//                 }) ;
//                 //we change the current node color to show the study of all possible pathes 
//                 //to reach this point so far
//                 if (alt < (distances.get(neighbor.to) ?? Infinity)) {
//                     distances.set(neighbor.to, alt);
//                     previous.set(neighbor.to, vertex);
//                     console.log(neighbor);
//                     minHeap.enqueue({ vertex: neighbor.to, distance: alt });
//                     let tmp = animation.pop();
//                     if (tmp.color == "pink") {
//                         tmp.color="yellow" ;
//                     }
//                     animation.push(tmp) ;
//                     animation.push({
//                         'node':  vertex ,
//                         'color': "pink"
//                     }) ;
//                 }                  
//             });
//         }
//         return null;
//     }
// }

class Dijkstra {
    //dijkstra algorithm
    graph; //this is to carry the inputted graph
    constructor(graph) {
        this.graph = graph; //intialization
    }
    shortestPath(start, end) {
        let animation = [] ;
        const distances = new Map(); //available distances
        const previous = new Map();
        const minHeap = new Heap([], (a, b) => a.distance < b.distance //priority function to create (minHeap)
        ); //this datastructure is documented withing the code it self in side lib
        distances.set(start, 0);
        minHeap.enqueue({ vertex: start, distance: 0 });
        this.graph.getNeighbors(start)?.forEach(neighbor => {
            //coping the graph nodes setting it's distances to infinity
            distances.set(neighbor.to, Infinity);
            //setting visited node with null
            previous.set(neighbor.to, null);
            animation.push({
                'node':  neighbor.to ,
                'color': "grey"
            });
        });
        while (minHeap.length() > 0) { //starting the algo
            //cost to vertex 
            const { vertex, distance } = minHeap.dequeue(); //deqeueuing the first node
            // last
            if (vertex === end) { //check if it the final vertix
                const path = [];
                let current = end;
                while (current !== null) {
                    path.unshift(current);
                    current = previous.get(current) ?? null;
                }
                animation.forEach((el,i)=>{
                    if(path.includes(el.node)){
                        el.color = "blue";
                        animation.splice(i+1,0,{...el});
                        el.color = "grey";
                    }
                });
                return { distance, path , animation };
            }

            // get neighbors
            let tmp = null;
            this.graph.getNeighbors(vertex)?.forEach(neighbor => {
                //neighbor is an edge not a node - Edge(vertex , neighbor.to) O-- 10 --O 10 is neighbor.weight
                const alt = distance + neighbor.weight;
                if (alt < (distances.get(neighbor.to) ?? Infinity)) {
                    animation.push({
                        'node':  neighbor.to ,
                        'color': "grey"
                    });
                    distances.set(neighbor.to, alt);//new vertex + cost_totalCost
  
                    previous.set(neighbor.to, vertex);//current visited edge
                    // console.log(neighbor);
                    minHeap.enqueue({ vertex: neighbor.to, distance: alt });
                    // tmp = animation.pop();
                    // animation.push(tmp) ;

                }
            });
         
        }
        return null;
    }
}


export default Dijkstra;
