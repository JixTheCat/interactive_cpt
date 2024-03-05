import React, { useCallback, useState , useEffect} from 'react';
import ForceGraphDAG from './chart.jsx';
import NodeEditPanel from './NodeEditPanel';
import './App.css';
import getJSONData from './export_data.js';

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [graphData, setGraphData] = useState(getJSONData()); // Initial graph data
  console.log(graphData);
  // // Fetch initial graph data asynchronously
  // useEffect(() => {
  //   const fetchDataAsync = async () => {
  //     const data = await getJSONData();
  //     setGraphData(data); // Set the fetched graph data
  //   };
  //   fetchDataAsync();
  // }, []);

  const updateData = async () => {
    const newData = await getJSONData(); // Refetch the graph data
    setGraphData(newData); // Update the graph data
  };

  // Function to handle node selection
  const handleNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    updateData();
  }, []);

  // Function to handle node updates
  const handleNodeUpdate = async (updatedNode) => {
    // Update the node in the graph data
    const updatedData = {
      ...graphData,
      weights: graphData.weights.map(weight => weight.id === updatedNode.id ? updatedNode : weight),
    };
    setGraphData(updatedData); // Update the local state
    setSelectedNodeId(null); // Clear the selected node ID after updating
    await updateData(); // Optionally refetch the entire dataset from the server if needed
  };

  return (
    <div className="App">
      {graphData && ( // Ensure graphData is loaded before rendering ForceGraphDAG
        <ForceGraphDAG data={graphData} onNodeClick={handleNodeClick} />
      )}
      {selectedNodeId && graphData && ( // Ensure graphData is loaded before rendering NodeEditPanel
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