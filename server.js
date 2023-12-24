// server.js
const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('.'));

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYzZhOTU4NTBhOGEwMmRhMWNkN2YxYiIsImlhdCI6MTcwMzIzNTIxOCwiZXhwIjoxNzA1ODI3MjE4fQ.8JgeF6BXTprNS9IBa7yW1LtN3E13fCuBo9LiYMLy4A8`);
});
