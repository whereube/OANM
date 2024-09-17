import { createServer } from './server.js';

const port = 5432;

const server = createServer();

server.listen(port, () => {
  console.log(`HTTPS server running on ${port}`);
});
