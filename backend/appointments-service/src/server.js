import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { pool, healthCheck } from './db.js';
import { initDb } from './db.init.js';

import appointmentsRouter from './v1/appointments.routes.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Health
app.get('/health', async (req, res) => {
  try {
    await healthCheck();
    res.json({ status: 'ok', service: 'appointments-service', db: 'up' });
  } catch {
    res.status(503).json({ status: 'degraded', service: 'appointments-service', db: 'down' });
  }
});

// Routes
app.use('/api/v1/appointments', appointmentsRouter);

const PORT = process.env.PORT || 4003;

async function start() {
  try {
    // Ensure schema exists
    await initDb();

    // Touch DB on startup to fail fast if misconfigured
    await healthCheck();
    console.log('Connected to PostgreSQL');
    app.listen(PORT, () => console.log(`Appointments service listening on :${PORT}`));
  } catch (err) {
    console.error('Failed to start service', err);
    process.exit(1);
  }
}

start();
