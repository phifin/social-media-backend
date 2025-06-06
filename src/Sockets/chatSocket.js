import jwt from 'jsonwebtoken';
import Message from '../Models/message.js';
import GroupChatMessage from '../Models/groupChatMessage.js';

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

    // ===== PRIVATE CHAT =====
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

    // ===== GROUP CHAT =====

    // Khi người dùng vào phòng group
    socket.on('join_group', (groupId) => {
      socket.join(groupId); // Tham gia phòng group
      console.log(`User ${userId} joined group ${groupId}`);
    });

    // Khi người dùng rời group (tuỳ frontend gọi khi rời UI group)
    socket.on('leave_group', (groupId) => {
      socket.leave(groupId);
      console.log(`User ${userId} left group ${groupId}`);
    });

    // Gửi tin nhắn trong group
    socket.on('group_message', async ({ groupId, content, type }) => {
      const message = await GroupChatMessage.create({
        groupId,
        sender: userId,
        content,
        type: type || 'text'
      });

      // Gửi đến tất cả socket trong phòng group đó (kể cả sender)
      io.to(groupId).emit('group_message', {
        _id: message._id,
        groupId,
        sender: userId,
        content,
        type: message.type,
        createdAt: message.createdAt
      });
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      console.log(`User disconnected: ${userId}`);
    });
  });
};

export default chatSocket;
