const express = require('express');
const cors = require('cors')
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors())

app.use(express.json());

app.post('/api/runCppProgram', (req, res) => {
    // const { nodeId } = req.body;
  // Execute the C++ program
  // if (!nodeId) {
  //   return res.status(400).json({ error: 'Missing nodeId in request body' });
  // }

  const jsonString = JSON.stringify(req.body);
  const command = `./cppProgram '${jsonString}'`;
  exec(command, (error, stdout, stderr) => {
    // exec(`./cppProgram ${`hello`}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing C++ program: ${error.message}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(`Input: ${JSON.stringify(req.body)}`);
    console.log(`C++ program output: ${stdout}`);
    console.error(`C++ program error: ${stderr}`);
    res.json({ output: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});