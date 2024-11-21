import Dijkstra from "./lib/dikistarAlgo.js";
import Graph from "./lib/Graph.js";
import { test1, test2, test3, test4, test5, test6, test7, test8, test9, test10 } from './DataForTesting.js';

let startNode = null; // Variable for the start node
let endNode = null;   // Variable for the end node
let converter = {}; // used to convert between the ui graph and the graph
let animation = [];
let path = [];
let distance = 0;
let currentStep = 0;
let table = [];
let lastTable = [];
const $ = go.GraphObject.make;

// Initialize the Diagram
const myDiagram = $(go.Diagram, "diagramDiv", {
  initialContentAlignment: go.Spot.Center,
  "undoManager.isEnabled": true, // Enable undo/redo
  "clickCreatingTool.archetypeNodeData": { key: "New Node" },
  model: new go.GraphLinksModel([], [])
});


myDiagram.nodeTemplate = $(
  go.Node,
  "Auto",
  { selectable: true }, // Make nodes selectable
  $(go.Shape, "Circle", {
    name: "SHAPE",  // Name the Shape so it can be accessed
    width: 100,
    height: 100,
    fill: "lightblue",
    strokeWidth: 0
  }), // Bigger node size
  $(go.TextBlock,
    {
      margin: 5,
      editable: true
    },
    new go.Binding("text", "key").makeTwoWay(), // Bind 'text' to 'key' with two-way binding
    {
      // Event handler for when text is edited
      textEdited: function (e, obj) {
        const node = obj.part; // The node being edited
        const newText = obj.text; // New text value entered by the user

        if (node && newText) {
          const oldKey = node.data.key;
          if (newText !== oldKey) {
            // Update both the text and key to the new value
            myDiagram.startTransaction("rename node");
            myDiagram.model.setDataProperty(node.data, "key", newText); // Update key to match the new text
            myDiagram.model.setDataProperty(node.data, "text", newText); // Update text to match the new key
            myDiagram.commitTransaction("rename node");
          }
        }
      }
    }
  ) // Bind 'key' as the node's label
);


// Define the Link (line) template
myDiagram.linkTemplate = $(
  go.Link,  // Defines the entire link panel
  {
    selectable: true, // Make the link selectable
    routing: go.Link.Normal, // Straight-line routing
    curve: go.Link.None // No curves—straight line
  },
  $(
    go.Shape,  // Main link line
    {
      name: "SHAPE", // Important for accessing and modifying later
      strokeWidth: 2, // The line's thickness
      stroke: "black" // Default line color
    }
  ),
  $(
    go.TextBlock,  // A label to display cost or other details
    "Cost", // Default text
    {
      segmentOffset: new go.Point(0, -10), // Position above the line
      editable: true, // Let the user edit it
      font: "10pt sans-serif", // Nice and readable font
      stroke: "blue" // Label color for clarity
    },
    new go.Binding("text", "cost").makeTwoWay() // Bind the label to data
  )
);

// Add Node Functionality
document.getElementById("addNode").addEventListener("click", () => {
  const nodeDataArray = myDiagram.model.nodeDataArray;
  const newNodeKey = nodeDataArray.length + 1;
  myDiagram.model.addNodeData({ key: `Node ${newNodeKey}` });
});

// Select two nodes and make a connection
document.getElementById("makeConnection").addEventListener("click", () => {
  const selectedNodes = myDiagram.selection.toArray().filter(part => part instanceof go.Node);

  if (selectedNodes.length === 2) {
    const [node1, node2] = selectedNodes;
    const linkData = { from: node1.data.key, to: node2.data.key, cost: "Cost" };
    myDiagram.model.addLinkData(linkData);
  } else {
    alert("Please select exactly two nodes to connect.");
  }
});

// Delete Node Functionality
document.getElementById("deleteNode").addEventListener("click", () => {
  const selectedParts = myDiagram.selection.toArray();

  if (selectedParts.length === 0) {
    alert("Please select at least one node or link to delete.");
    return;
  }

  myDiagram.startTransaction("delete parts");
  selectedParts.forEach(part => {
    if (part instanceof go.Node || part instanceof go.Link) {
      myDiagram.remove(part);
    }
  });
  myDiagram.commitTransaction("delete parts");
});

// Function to delete the path (link) between two nodes
document.getElementById("deletePathButton").addEventListener("click", () => {
  const selectedNodes = myDiagram.selection.toArray().filter(part => part instanceof go.Node);

  if (selectedNodes.length === 2) {
    const [node1, node2] = selectedNodes;

    // Iterate over all outgoing links of node1 and find the one that connects to node2
    let link1ToRemove = null;
    node1.findLinksOutOf().each(link => {
      if (link.toNode === node2) {
        link1ToRemove = link;
      }
    });

    let link2ToRemove = null;
    node2.findLinksOutOf().each(link => {
      if (link.toNode === node1) {
        link2ToRemove = link;
      }
    });

    if (link1ToRemove) {
      myDiagram.startTransaction("delete path");
      myDiagram.remove(link1ToRemove);
      myDiagram.commitTransaction("delete path");
    }
    if (link2ToRemove) {
      myDiagram.startTransaction("delete path");
      myDiagram.remove(link2ToRemove);
      myDiagram.commitTransaction("delete path");
    }

    if (!(link2ToRemove || link1ToRemove)) {
      alert(`No path exists between "${node1.data.key}" and "${node2.data.key}".`);
    }
  } else {
    alert("Please select exactly two nodes to delete the path.");
  }
});



// Clear Diagram Functionality
document.getElementById("clearDiagram").addEventListener("click", () => {
  myDiagram.model = new go.GraphLinksModel([], []);
});


// Update the color of a specified node
function updateNodeColor(node, rgbColor) {
  if (!(node instanceof go.Node)) {
    console.error("The first parameter must be a valid GoJS Node.");
    return;
  }

  const shape = node.findObject("SHAPE"); // Find the Shape object of the node
  if (shape) {
    myDiagram.startTransaction("change node color");
    shape.fill = rgbColor; // Set the fill color of the Shape
    myDiagram.commitTransaction("change node color");
  } else {
    console.error("Node does not have a Shape object.");
  }
}


window.updateNodeColorByName = function updateNodeColorByName(nodeName, rgbColor) {
  // Look for the node by its current "key" (name)
  const node = myDiagram.findNodeForKey(nodeName);
  updateNodeColor(node, rgbColor);
}

// Update the color of a specified node
window.updateEdgeColorByNodeNames = function updateEdgeColorByNodeNames(nodeName1, nodeName2, rgbColor) {
  let foundLink = null;

  // Find the starting node
  startNode = myDiagram.findNodeForKey(nodeName1);
  if (!startNode) {
    console.error(`Node with name "${nodeName1}" not found.`);
    return;
  }

  // Look for a link going to nodeName2
  startNode.findLinksOutOf().each(link => {
    if (link.toNode && link.toNode.data.key === nodeName2) {
      foundLink = link;
    }
  });

  // Try the reverse direction if no link was found
  if (!foundLink) {
    endNode = myDiagram.findNodeForKey(nodeName2);
    if (endNode) {
      endNode.findLinksOutOf().each(link => {
        if (link.toNode && link.toNode.data.key === nodeName1) {
          foundLink = link;
        }
      });
    }
  }

  if (!foundLink) {
    console.error(`No link found between "${nodeName1}" and "${nodeName2}".`);
    return;
  }

  // Access the Shape object within the Link
  const linkShape = foundLink.findObject("SHAPE");
  if (linkShape) {
    myDiagram.startTransaction("change link color");
    linkShape.stroke = rgbColor; // Change the line color
    myDiagram.commitTransaction("change link color");
    console.log(`Link color updated between "${nodeName1}" and "${nodeName2}" to ${rgbColor}.`);
  } else {
    console.error("The link does not contain a Shape object named 'SHAPE'.");
  }
}



// Function to set the selected node as the start node and change its color to red
function setStartNode() {
  const selectedNodes = myDiagram.selection.toArray().filter(part => part instanceof go.Node);

  if (selectedNodes.length === 1) {
    if (startNode) updateNodeColor(startNode, "lightblue"); // Reset previous start node

    startNode = selectedNodes[0];
    updateNodeColor(startNode, "rgb(255, 0, 0)"); // Red color for start node
    console.log(`Start node set to: ${startNode.data.key}`);
  } else {
    alert("Please select exactly one node to set as the start node.");
  }
}

// Function to set the selected node as the end node and change its color to green
function setEndNode() {
  const selectedNodes = myDiagram.selection.toArray().filter(part => part instanceof go.Node);

  if (selectedNodes.length === 1) {
    if (endNode) updateNodeColor(endNode, "lightblue"); // Reset previous end node

    endNode = selectedNodes[0];
    updateNodeColor(endNode, "rgb(0, 255, 0)"); // Green color for end node
    console.log(`End node set to: ${endNode.data.key}`);
  } else {
    alert("Please select exactly one node to set as the end node.");
  }
}

// Function to build the adjacency list
function buildAdjacencyList(diagram) {
  const adjacencyList = {};

  // Iterate through all nodes in the diagram
  diagram.nodes.each(node => {
    const key = node.data.key; // Current node's key
    const neighbors = [];

    // Find all outgoing links from this node
    node.findLinksOutOf().each(link => {
      const targetNode = link.toNode;
      if (targetNode) {
        const cost = link.data.cost; // Retrieve the actual cost from link data
        neighbors.push({ node: targetNode.data.key, cost: cost }); // Add target node and cost
      }
    });

    adjacencyList[key] = neighbors;
  });

  // Include start and end nodes in the adjacency list object
  const exportData = {
    adjacencyList,
    startNode: startNode ? startNode.data.key : null,
    endNode: endNode ? endNode.data.key : null
  };

  return exportData;
}


// Function to print the adjacency list using SweetAlert
function printAdjacencyList() {
  const { adjacencyList, startNode, endNode } = buildAdjacencyList(myDiagram);

  const exportData = {
    adjacencyList,
    startNode,
    endNode
  };

  const exportDataStr = JSON.stringify(exportData, null, 2); // Pretty print the JSON

  // Display using SweetAlert2
  Swal.fire({
    title: "Graph Export",
    html: `<button onclick='if (navigator.clipboard) { navigator.clipboard.writeText(${JSON.stringify(exportDataStr)}) .then(() => { alert("Text copied to clipboard successfully!"); }) .catch(err => { console.error("Failed to copy text to clipboard: ", err); }); } else { console.error("Clipboard API not available.");}'>copy</button><pre>${exportDataStr}</pre>`, // Preformatted text for better display
    icon: "info",
    confirmButtonText: "Close"
  });
}



function importAdjacencyList(adjacencyData) {
  const { adjacencyList, startNode: startNodeKey, endNode: endNodeKey } = adjacencyData;

  myDiagram.model = new go.GraphLinksModel([], []); // Clear current graph

  // Create a Set to keep track of already added edges (in both directions)
  const addedEdges = new Set();

  // Import nodes first
  for (const nodeKey in adjacencyList) {
    myDiagram.model.addNodeData({ key: nodeKey });
  }

  // Import links (edges)
  for (const nodeKey in adjacencyList) {
    const neighbors = adjacencyList[nodeKey];
    for (const neighbor of neighbors) {
      const { node: neighborNode, cost } = neighbor;

      // Ensure we only add each edge once by considering both directions
      const edgeKey = [nodeKey, neighborNode].sort().join('-');

      if (!addedEdges.has(edgeKey)) {
        // Add the link only if it has not been added already
        myDiagram.model.addLinkData({
          from: nodeKey,
          to: neighborNode,
          cost: cost
        });

        // Mark this edge as added by adding it to the Set
        addedEdges.add(edgeKey);
      }
    }
  }

  // Set the start and end nodes (if they exist in the imported data)
  if (startNodeKey) {
    startNode = myDiagram.findNodeForKey(startNodeKey);
    if (startNode) updateNodeColor(startNode, "rgb(255, 0, 0)"); // Color for start node
  }

  if (endNodeKey) {
    endNode = myDiagram.findNodeForKey(endNodeKey);
    if (endNode) updateNodeColor(endNode, "rgb(0, 255, 0)"); // Color for end node
  }

  console.log('Graph imported successfully with start and end nodes.');
}



// Function to re-import the adjacency list and reconstruct the graph
function importAdjacencyListFromInput() {
  Swal.fire({
    title: 'Import Graph Data',
    input: 'textarea',
    inputPlaceholder: 'Paste your graph data here...',
    showCancelButton: true,
    confirmButtonText: 'Import',
    cancelButtonText: 'Cancel',
    inputValidator: (value) => {
      if (!value) {
        return 'You need to enter graph data!';
      }

      try {
        const cleanedValue = value.trim();
        const graphData = JSON.parse(cleanedValue);

        // Validate structure
        if (
          !graphData.adjacencyList ||
          typeof graphData.adjacencyList !== 'object' ||
          Array.isArray(graphData.adjacencyList)
        ) {
          return 'Invalid adjacency list structure!';
        }

        // Import the graph data
        importAdjacencyList(graphData);
        return null; // No error
      } catch (error) {
        return 'Invalid JSON format! Ensure it is valid JSON.';
      }
    }
  });
}

function applyAlgo() {
  // save json of adjacency list into variable adjacencyList
  const { startNode, endNode, adjacencyList } = buildAdjacencyList(myDiagram);
  const graph = new Graph(); // create graph variable

  let i = 0;
  for (let node in adjacencyList) {
    converter[node] = i++;
  }
  //input graph from user 
  //build adjacency list
  for (let n in adjacencyList) {
    adjacencyList[n].forEach(el => {
      console.log(converter[n], converter[el.node], parseInt(el.cost));
      console.log(n, el.node, parseInt(el.cost));
      graph.AddEdge(converter[n], converter[el.node], parseInt(el.cost));
    });
  }
  const dijkstra = new Dijkstra(graph);
  const result = dijkstra.shortestPath(converter[startNode], converter[endNode]);
  //"path":[0,2,1,4,5]}
  //distance
  for (i = 0; i < result.path.length; i++) {
    result.path[i] = getKeyByValue(converter, result.path[i]);
  }
  alert("shortest path is:\n[" + result.path+"]");
  animation = result.animation;
  distance = result.distance;
  path = result.path;
  table = result.table;
  // alert(JSON.stringify(result));
  // displayRounds(table);

  let last_round = table.length - 1;
  let last_table = table[last_round];
  let end_node_index_in_last_round = -1;
  for (let i = 0; i < last_table.length; i++) {
    console.log(last_table[i].distances);
    // if (converter[endNode.key] == last_table[i]) {
    //   end_node_index_in_last_round = i ; 
    //   break
    // }
  }
  // alert(last_table[end_node_index_in_last_round])

}

function animate() {
  const timer = setInterval(() => {
    if (animation[currentStep]) {

      let currentAnimation = animation[currentStep];
      if (currentAnimation.edge) {
        let first = getKeyByValue(converter, currentAnimation.edge[0]);
        let second = getKeyByValue(converter, currentAnimation.edge[1]);
        updateEdgeColorByNodeNames(first, second, currentAnimation.color);
      } else {
        let first = getKeyByValue(converter, currentAnimation.node);
        updateNodeColorByName(first, currentAnimation.color);
      }
      currentStep++;
    }
    // currentStep = currentStep % animation.length ; 
    else {
      currentStep = currentStep - 1;
      clearInterval(timer);
      alert("animation done");
    }
  }, 200);

}

function getKeyByValue(obj, value) {
  for (const key in obj) {
    if (obj[key] == value) {
      return key;
    }
  }
  return null; // or undefined, if the value is not found
}

// Function to display the rounds using SweetAlert2
function displayRounds() {
  // Build the HTML table dynamically
  let htmlTable = `
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
              <tr>
                  <th style="border-bottom: 1px solid #ddd; padding: 8px;">Round</th>
                  <th style="border-bottom: 1px solid #ddd; padding: 8px;">Node</th>
                  <th style="border-bottom: 1px solid #ddd; padding: 8px;">Distance</th>
                  <th style="border-bottom: 1px solid #ddd; padding: 8px;">Previous</th>
              </tr>
          </thead>
          <tbody>
  `;

  // Loop through each round in the table
  table.forEach((round, index) => {
    round.distances.forEach((distance, node) => {
      htmlTable += `
              <tr>
                  <td style="border-bottom: 1px solid #ddd; padding: 8px;">${index + 1}</td>
                  <td style="border-bottom: 1px solid #ddd; padding: 8px;">${getKeyByValue(converter, node)}</td>
                  <td style="border-bottom: 1px solid #ddd; padding: 8px;">${distance === Infinity ? '∞' : distance}</td>
                  <td style="border-bottom: 1px solid #ddd; padding: 8px;">${getKeyByValue(converter, round.previous.get(node)) ?? 'None'}</td>
              </tr>
          `;
    });
  });

  // Close the table tags
  htmlTable += `
          </tbody>
      </table>
  `;

  // Use SweetAlert2 to display the table
  Swal.fire({
    title: 'Dijkstra Algorithm Rounds',
    html: htmlTable,
    width: '800px',
    showCloseButton: true,
    confirmButtonText: 'Close'
  });
}

function displayLastRound() {
  // Get the last round from the table
  const lastRoundIndex = table.length - 1;
  const lastRound = table[lastRoundIndex];

  // Build the HTML table for the last round
  let htmlTable = `
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
              <tr>
                  <th style="border-bottom: 1px solid #ddd; padding: 8px;">Node</th>
                  <th style="border-bottom: 1px solid #ddd; padding: 8px;">Distance</th>
                  <th style="border-bottom: 1px solid #ddd; padding: 8px;">Previous</th>
              </tr>
          </thead>
          <tbody>
  `;

  // Loop through the distances of the last round
  lastRound.distances.forEach((distance, node) => {
    htmlTable += `
          <tr>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${getKeyByValue(converter, node)}</td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${distance === Infinity ? '∞' : distance}</td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${getKeyByValue(converter, lastRound.previous.get(node)) ?? 'None'}</td>
          </tr>
      `;
  });

  // Close the table tags
  htmlTable += `
          </tbody>
      </table>
  `;

  // Use SweetAlert2 to display the last round
  Swal.fire({
    title: 'Dijkstra Algorithm - Final Round',
    html: htmlTable,
    width: '600px',
    showCloseButton: true,
    confirmButtonText: 'Close'
  });
}

// Example usage with the table and converter
// Pass the table and the converter object
// const converter = { "Node 1": 0, "Node 2": 1, "Node 3": 2, ... };
// displayLastRound(dijkstraResult.table, converter);


// console.log("output");
// Add event listeners to the buttons
document.getElementById("setStartNodeButton").addEventListener("click", setStartNode);
document.getElementById("setEndNodeButton").addEventListener("click", setEndNode);
// Add event listeners to the buttons
document.getElementById("printAdjacencyListButton").addEventListener("click", printAdjacencyList);
document.getElementById("importAdjacencyListFromInput").addEventListener("click", importAdjacencyListFromInput);
document.getElementById("applyAlgo").addEventListener("click", applyAlgo);
document.getElementById("animate").addEventListener("click", animate);
document.getElementById("showRounds").addEventListener("click", displayRounds);
document.getElementById("displayLastRound").addEventListener("click", displayLastRound);


document.getElementById("t1").onclick = () => {
  importAdjacencyList(test1);

};
document.getElementById("t2").onclick = () => {
  importAdjacencyList(test2);

};
document.getElementById("t3").onclick = () => {
  importAdjacencyList(test3);

};
document.getElementById("t4").onclick = () => {
  importAdjacencyList(test4);

};
document.getElementById("t5").onclick = () => {
  importAdjacencyList(test5);

};
document.getElementById("t6").onclick = () => {
  importAdjacencyList(test6);

};
document.getElementById("t7").onclick = () => {
  importAdjacencyList(test7);

};
document.getElementById("t8").onclick = () => {
  importAdjacencyList(test8);

};
document.getElementById("t9").onclick = () => {
  importAdjacencyList(test9);

};
document.getElementById("t10").onclick = () => {
  importAdjacencyList(test10);

};