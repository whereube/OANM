import { createServer } from './server.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load environment variables from .env
config();

const port = process.env.PORT || process.env.SERVER_PORT;
const server = createServer();

// __filename and __dirname are not available in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app
server.use(express.static(path.join(__dirname, '../client/frontend/build')));

// Handle any non-API routes by serving the React app
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/frontend/build', 'index.html'));
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
