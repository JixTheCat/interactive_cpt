import React, { useState, useCallback } from 'react';
import ForceGraphDAG from './chart.jsx';
import NodeEditPanel from './NodeEditPanel';
import './App.css'

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Function to handle node selection
  const handleNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id); // Store the clicked node ID
  }, []);

  // Function to handle node updates
  const handleNodeUpdate = useCallback((updatedNode) => {
    // Implement logic to update the node in your data or state
    console.log(`Node ${selectedNodeId} Updated: ${updatedNode}`);
    // Clear the selected node ID after updating
    setSelectedNodeId(null);
  }, [selectedNodeId]);

  return (
    <div className="App">
      <header className="App-header">
        {selectedNodeId !== null && (
          <NodeEditPanel selectedNodeId={selectedNodeId} onNodeUpdate={handleNodeUpdate} />
        )}
        <ForceGraphDAG onNodeClick={handleNodeClick} />
      </header>
    </div>
  );
}

export default App;
