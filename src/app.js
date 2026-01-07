import express from 'express';
import path from 'path';
import { schedule } from './config/scheduler.js';
import { syncJob } from './jobs/sync.job.js';
import { ENV } from './config/env.js';
import { getAuditByDate } from './controllers/audit.controller.js';
import { getRealtimeLogs, forceSync } from './controllers/system.controller.js';
import { logger } from './utils/logger.js';

const app = express();

app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.json());

app.get('/api/logs', getRealtimeLogs);
app.post('/api/force-sync', forceSync); 
app.get('/api/audit/:date', getAuditByDate);


app.listen(ENV.PORT, () => {
  logger.info(`🚀 Servidor rodando na porta ${ENV.PORT}`);
  schedule(syncJob);
});