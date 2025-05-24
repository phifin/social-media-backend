import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from './Config/config.js';
import authRoutes from './Routes/AuthRoutes.js'; 
import userRoutes from './Routes/UserRoutes.js';
import FileRouter from './Routes/FileRoutes.js';
import ChatRouter from './Routes/ChatRoutes.js'
import PrivacyUserRouter from './Routes/PrivacyRoutes.js';
import { Server } from 'socket.io';
import chatSocket from './Sockets/chatSocket.js';
import http from 'http'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.js';

config();   
connectDB();

const app = express();

app.use(cors());
app.use(json());
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});
  
chatSocket(io);
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/files', FileRouter);
app.use('/api/privacy', PrivacyUserRouter)
app.use('/api/chat', ChatRouter)

export default app;
