import jwt from 'jsonwebtoken';
import Message from '../Models/message.js';

const connectedUsers = new Map(); // userId -> socket.id

const chatSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    connectedUsers.set(userId, socket.id);
    console.log(`User connected: ${userId} (${socket.id})`);

    socket.on('private_message', async ({ to, content, type }) => {
      const message = await Message.create({
        from: userId,
        to,
        content,
        type: type || 'text'
      });

      const toSocketId = connectedUsers.get(to);
      if (toSocketId) {
        io.to(toSocketId).emit('private_message', message);
      }
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      console.log(`User disconnected: ${userId}`);
    });
  });
};

export default chatSocket;
