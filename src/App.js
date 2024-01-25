import React, { useState } from 'react';
import ForceGraphDAG from './chart';
import NodeEditPanel from './NodeEditPanel';
import './App.css';

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Function to handle node selection
  const handleNodeClick = (event, node) => {
    setSelectedNodeId(node.id); // Store the clicked node ID
  };

  const handleRunCppProgram = (newId) => {
    fetch('http://localhost:3001/api/runCppProgram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedNodeId, newId }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('C++ Program Output:', responseData.output);
      })
      .catch(error => {
        console.error('Error calling C++ API:', error);
      });
  };

  // Function to handle node updates
  const handleNodeUpdate = (updatedNode) => {
    // Implement logic to update the node in your data or state
    console.log(`Node ${selectedNodeId} Updated: ${updatedNode}`);
    // Clear the selected node ID after updating
    handleRunCppProgram(updatedNode)
    setSelectedNodeId(null);
  };

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