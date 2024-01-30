import React, { useState, useEffect } from 'react';
import { runCppProgram } from './apiService';

const NodeEditPanel = ({ selectedNodeId, weights, onNodeUpdate }) => {
  // Find weights for the selected node
  const selectedNodeWeights = weights.find(weight => weight.id === selectedNodeId);

  // State to manage input field values
  const [inputValues, setInputValues] = useState({
    Ideal: 0.95,
    NotIdeal: 0.05,
    id: "Environmental Impact",
    scores: {}
  });

  // State to manage new weight input fields
  const [newWeights, setNewWeights] = useState([{ id: '', score: '' }]);

  // Initialize input field values when selectedNodeId changes
  useEffect(() => {
    if (selectedNodeWeights) {
      setInputValues({
        Ideal: selectedNodeWeights.Ideal || 0.95,
        NotIdeal: selectedNodeWeights.NotIdeal || 0.05,
        id: selectedNodeWeights.id || "Environmental Impact",
        scores: selectedNodeWeights.scores || {}
      });
    }
  }, [selectedNodeWeights, selectedNodeId]);

  // Function to handle updating weights
  const handleWeightChange = (scoreId, newValue) => {
    // Update the input values state
    setInputValues(prevState => ({
      ...prevState,
      scores: {
        ...prevState.scores,
        [scoreId]: newValue
      }
    }));

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

  // Function to handle updating other attributes
  const handleAttributeChange = (attribute, newValue) => {
    setInputValues(prevState => ({
      ...prevState,
      [attribute]: newValue
    }));
  };

  // Function to handle adding a new weight field
  const handleAddWeightField = () => {
    setNewWeights([...newWeights, { id: '', score: '' }]);
  };

  // Function to handle adding new weight to the state
  const handleAddWeight = () => {
    const updatedNewWeights = newWeights.filter(weight => weight.id && weight.score);
    const newScores = {};
    updatedNewWeights.forEach(weight => {
      newScores[weight.id] = weight.score;
    });

    setInputValues(prevState => ({
      ...prevState,
      scores: {
        ...prevState.scores,
        ...newScores
      }
    }));

    setNewWeights([{ id: '', score: '' }]);
  };

  // Function to handle generating and returning  JSON
  const handleGenerateJSON = () => {
  // Define the JSON object
  const json = JSON.stringify({
    Ideal: inputValues.Ideal,
    NotIdeal: inputValues.NotIdeal,
    id: inputValues.id,
    scores: inputValues.scores
  });

  // Convert JSON object to string
  // const jsonString = JSON.stringify(json, 4);
  console.log(json); // Output JSON to console or you can send it wherever you need

  // Call the function to run the C++ program with the JSON as an argument
  runCppProgram(selectedNodeId, json);
};


  return (
    <div>
      <h2>Edit Node ID {selectedNodeId}</h2>
      {/* Editable fields for attributes */}
      <div>
        <label htmlFor="ideal">Ideal:</label>
        <input
          id="ideal"
          type="text"
          value={inputValues.Ideal}
          onChange={e => handleAttributeChange('Ideal', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="notIdeal">Not Ideal:</label>
        <input
          id="notIdeal"
          type="text"
          value={inputValues.NotIdeal}
          onChange={e => handleAttributeChange('NotIdeal', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="id">ID:</label>
        <input
          id="id"
          type="text"
          value={inputValues.id}
          onChange={e => handleAttributeChange('id', e.target.value)}
        />
      </div>

      {/* Editable fields for new weights */}
      <div>
        {newWeights.map((weight, index) => (
          <div key={index}>
            <label htmlFor={`newWeightId${index}`}>New Weight ID:</label>
            <input
              id={`newWeightId${index}`}
              type="text"
              value={weight.id}
              onChange={e => {
                const updatedNewWeights = [...newWeights];
                updatedNewWeights[index].id = e.target.value;
                setNewWeights(updatedNewWeights);
              }}
            />
            <label htmlFor={`newWeightScore${index}`}>Score:</label>
            <input
              id={`newWeightScore${index}`}
              type="text"
              value={weight.score}
              onChange={e => {
                const updatedNewWeights = [...newWeights];
                updatedNewWeights[index].score = e.target.value;
                setNewWeights(updatedNewWeights);
              }}
            />
          </div>
        ))}
        <button onClick={handleAddWeightField}>Add New Weight Field</button>
        <button onClick={handleAddWeight}>Add Weight</button>
      </div>

      {/* Display weights */}
      {selectedNodeWeights && (
        <div>
          <h3>Weights:</h3>
          {Object.entries(inputValues.scores).map(([scoreId, weight]) => (
            <div key={scoreId}>
              <label htmlFor={scoreId}>{scoreId}:</label>
              <input
                id={scoreId}
                type="text"
                value={inputValues.scores[scoreId] || ''}
                onChange={e => handleWeightChange(scoreId, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Button to generate and return JSON */}
      <button onClick={handleGenerateJSON}>Save</button>
    </div>
  );
};

export default NodeEditPanel;
