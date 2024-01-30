const runCppProgram = (id, jsonData) => {
    const requestData = {
        id: id,
        jsonData: jsonData
    };

    return fetch('http://localhost:3001/api/runCppProgram', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(responseData => {
        return responseData.output;
    })
    .catch(error => {
        throw new Error('Error calling C++ API: ' + error.message);
    });
};

export { runCppProgram };