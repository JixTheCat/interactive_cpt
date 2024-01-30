import React, { useState, useEffect } from 'react';

const NodeEditPanel = ({ selectedNodeId, weights, onNodeUpdate }) => {
  // Find weights for the selected node
  const selectedNodeWeights = weights.find(weight => weight.id === selectedNodeId);

  // State to manage input field values
  const [inputValues, setInputValues] = useState({});

  // Initialize input field values when selectedNodeId changes
  useEffect(() => {
    if (selectedNodeWeights) {
      setInputValues(selectedNodeWeights.scores);
    }
  }, [selectedNodeWeights, selectedNodeId]);

  // Function to handle updating weights
  const handleWeightChange = (scoreId, newValue) => {
    // Update the input values state
    setInputValues({
      ...inputValues,
      [scoreId]: newValue
    });

    // Update the weights for the selected node
    const updatedWeights = weights.map(weight => {
      if (weight.id === selectedNodeId) {
        return {
          ...weight,
          scores: {
            ...weight.scores,
            [scoreId]: newValue
          }
        };
      }
      return weight;
    });

    // Pass the updated weights to the parent component
    onNodeUpdate(updatedWeights);
  };

  return (
    <div>
      <h2>Edit Node ID {selectedNodeId}</h2>
      {/* Display weights */}
      {selectedNodeWeights && (
        <div>
          <h3>Weights:</h3>
          {Object.entries(selectedNodeWeights.scores).map(([scoreId, weight]) => (
            <div key={scoreId}>
              <label htmlFor={scoreId}>{scoreId}:</label>
              <input
                id={scoreId}
                type="text"
                value={inputValues[scoreId] || ''}
                onChange={e => handleWeightChange(scoreId, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NodeEditPanel;
