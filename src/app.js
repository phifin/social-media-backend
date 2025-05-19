import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from './Config/config.js';
import authRoutes from './Routes/AuthRoutes.js'; 
import userRoutes from './Routes/UserRoutes.js';
import FileRouter from './Routes/FileRoutes.js';
import PrivacyUserRouter from './Routes/PrivacyRoutes.js';

config();
connectDB();

const app = express();

app.use(cors());
app.use(json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/files', FileRouter);
app.use('/api/privacy', PrivacyUserRouter)

export default app;
