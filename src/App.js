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
      console.log('fetchAndSetData');
      const data = await fetchData(); // Fetch data asynchronously
      setGraphData(data); // Once data is fetched, update the state
    };

    fetchAndSetData(); // Call the function to fetch data
  }, []); // Empty dependency array means this effect runs once on component mount

  const updateData = async () => { // Make it an async function
    console.log('updateData');
    const newData = await fetchData(); // Await the fetched data
    setGraphData(newData); // Update the graph data with the new data
  };

  // Log the state of graphData for debugging
  console.log('in app');
  console.log(graphData);

  // Function to handle node selection
  const handleNodeClick = useCallback((event, node) => {
    console.log('handleNodeClick');
    setSelectedNodeId(node.id);
    updateData(); // This will refetch and update graphData
  });

  return (
    <div className="App">
      {graphData && ( // Check if graphData is loaded before rendering ForceGraphDAG
        <ForceGraphDAG 
          data={graphData}
          updateData={updateData}
          onNodeClick={handleNodeClick} 
        />
      )}
      {selectedNodeId && graphData && ( // Check if graphData is loaded before rendering NodeEditPanel
        <NodeEditPanel
          selectedNodeId={selectedNodeId}
          weights={graphData.weights}
          updateData={updateData}
        />
      )}
    </div>
  );
}

export default App;
