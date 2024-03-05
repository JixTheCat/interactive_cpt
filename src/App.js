import React, { useCallback, useState, useEffect } from 'react';
import ForceGraphDAG from './chart.jsx';
import NodeEditPanel from './NodeEditPanel';
import './App.css';
import fetchData from './export_data.js';

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [graphData, setGraphData] = useState(null); // Initialize graphData with null

  useEffect(() => {
    // Define an async function to fetch data
    const fetchAndSetData = async () => {
      const data = await fetchData(); // Fetch data asynchronously
      setGraphData(data); // Once data is fetched, update the state
    };

    fetchAndSetData(); // Call the function to fetch data
  }, []); // Empty dependency array means this effect runs once on component mount

  const updateData = async () => { // Make it an async function
    const newData = await fetchData(); // Await the fetched data
    setGraphData(newData); // Update the graph data with the new data
  };

  // Log the state of graphData for debugging
  console.log('in app');
  console.log(graphData);

  // Function to handle node selection
  const handleNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    updateData(); // This will refetch and update graphData
  }, []);

  // Function to handle node updates
  const handleNodeUpdate = async (updatedNode) => { // Make it an async function if needed
    // Assuming you want to update graphData synchronously here
    const updatedData = {
      ...graphData,
      weights: graphData.weights.map(weight => weight.id === updatedNode.id ? updatedNode : weight),
    };
    setGraphData(updatedData); // Update the graph data
    setSelectedNodeId(null); // Clear the selected node ID after updating
    await updateData(); // Refetch the entire dataset from the server if needed
  };

  return (
    <div className="App">
      {graphData && ( // Check if graphData is loaded before rendering ForceGraphDAG
        <ForceGraphDAG data={graphData} onNodeClick={handleNodeClick} />
      )}
      {selectedNodeId && graphData && ( // Check if graphData is loaded before rendering NodeEditPanel
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
