import React, { useCallback, useState } from 'react';
import ForceGraphDAG from './chart.jsx';
import NodeEditPanel from './NodeEditPanel';
import './App.css';
import getJSONData from './export_data.js';
import data from './data.json'; // Assuming data is imported from data.json

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [graphData, setGraphData] = useState(data); // Initial graph data, assuming it's fetched from data.json

  const updateData = (newData) => {
    setGraphData(getJSONData());
  };

  // Function to handle node selection
  const handleNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    updateData();
  }, []);

  // Function to handle node updates
  const handleNodeUpdate = (updatedNode) => {
    // Update the node in the graph data
    const updatedData = {
      ...graphData,
      weights: graphData.weights.map(weight => {
        if (weight.id === updatedNode.id) {
          return updatedNode;
        }
        return weight;
      })
    };
    // Update the graph data
    updateData();
    // setGraphData(updatedData);
    // Clear the selected node ID after updating
    setSelectedNodeId(null);
  };

  return (
    <div className="App">
      <ForceGraphDAG onNodeClick={handleNodeClick} />
        {/* Render the NodeEditPanel only if a node is selected */}
        {selectedNodeId !== null && (
          <NodeEditPanel
            selectedNodeId={selectedNodeId}
            weights={graphData.weights}
            onNodeUpdate={handleNodeUpdate}
            updateData={updateData}
          />
        )}
    </div>
  );
}

export default App;
