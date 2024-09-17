import express from 'express';
import path from 'path';
import { config } from 'dotenv';

config();

const app = express();
const port = process.env.PORT || 5432;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/frontend/build')));

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/frontend/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});