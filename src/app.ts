import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './modules/auth/auth.routes';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('TAC API is up and running');
});

export default app;

