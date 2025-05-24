import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from './Config/config.js';
import authRoutes from './Routes/AuthRoutes.js'; 
import userRoutes from './Routes/UserRoutes.js';
import FileRouter from './Routes/FileRoutes.js';
import ChatRouter from './Routes/ChatRoutes.js';
import PrivacyUserRouter from './Routes/PrivacyRoutes.js';
import GroupChatRouter from './Routes/GroupChatRoutes.js';
import GroupChatMessageRouter from './Routes/GroupChatMessageRoutes.js';
import PostRoutes from './Routes/PostRoutes.js'
import CommentRoutes from './Routes/CommentRoutes.js'
import CommunityRoutes from './Routes/CommunityRoutes.js'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.js';


config();   
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/files', FileRouter);
app.use('/api/privacy', PrivacyUserRouter);
app.use('/api/chat', ChatRouter);
app.use('/api/groupchat', GroupChatRouter);
app.use('/api/groupchatmessage', GroupChatMessageRouter);
app.use('/api/posts', PostRoutes);
app.use('/api/comments', CommentRoutes);
app.use('/api/community', CommunityRoutes);

export default app;
