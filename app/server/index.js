import { createServer } from './server.js';

const port = process.env.PORT || 443;

const server = createServer();

server.listen(port, () => {
  console.log(`HTTPS server running on port ${port}`);
});
