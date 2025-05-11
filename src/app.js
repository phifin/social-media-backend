import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from './Config/config.js';
import authRoutes from './Routes/AuthRoutes.js'; 
import userRoutes from './Routes/UserRoutes.js';

config();
connectDB();

const app = express();

app.use(cors());
app.use(json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

export default app;
