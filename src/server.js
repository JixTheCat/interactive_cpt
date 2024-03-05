const express = require('express');
const cors = require('cors')
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors())

app.use(express.json());

// Serve data.json on /api/config route
app.get('/api/config', (req, res) => {
  res.sendFile(path.join(__dirname, 'data.json'));
});

app.post('/api/runCppProgram', (req, res) => {

  console.log(`Server input: ${JSON.stringify(req.body)}`);

  const id = req.body.id.toLowerCase();
  console.log(`id: ${id}`);
  const jsonData = req.body.jsonData.toLowerCase();
  console.log(`jsonData: ${jsonData}`);

  const command = `./cppProgram '${id}' '${jsonData}'`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing C++ program: ${error.message}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(`\nC++ program output...\n ${stdout}`);
    console.error(`\nC++ program error...\n ${stderr}`);
    res.json({ output: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
