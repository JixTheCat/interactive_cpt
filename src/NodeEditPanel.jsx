import React, { useState } from 'react';

const NodeEditPanel = ({ selectedNodeId, onNodeUpdate }) => {
  const [editedNodeId, setEditedNodeId] = useState(selectedNodeId);

  const handleInputChange = (event) => {
    setEditedNodeId(event.target.value)
  };

  const handleUpdateClick = () => {
    onNodeUpdate(editedNodeId)
    // handleRunCppProgram(editedNodeId);
  };

  
  return (
    <div>
      <h2>Edit Node ID {selectedNodeId}</h2>
      <label>
        New Node ID:
        <input
          type="text"
          value={editedNodeId}
          onChange={handleInputChange}
        />
      </label>
      <button onClick={handleUpdateClick}>Update Node</button>
    </div>
  );
};

export default NodeEditPanel;
