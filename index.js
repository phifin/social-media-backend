import app from './src/app.js';
import http from 'http';
import { Server } from 'socket.io';
import chatSocket from './src/Sockets/chatSocket.js';
import { config } from 'dotenv';

config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

chatSocket(io);

server.listen(PORT, () => {
  console.log(`✅ Server is listening on http://localhost:${PORT}`);
});
