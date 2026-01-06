import express from 'express';
import path from 'path';
import { schedule } from './config/scheduler.js';
import { syncJob } from './jobs/sync.job.js';
import { ENV } from './config/env.js';
import { getAuditByDate } from './controllers/audit.controller.js';
import { getRealtimeLogs, forceSync } from './controllers/system.controller.js';
import { ENV } from './config/env.js';
const app = express();

// Config
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.json());


// Logs em Tempo Real
app.get('/api/logs', getRealtimeLogs);

// Botão pra forçar sincronização
app.post('/api/force-sync', forceSync); 

app.get('/api/audit/:date', getAuditByDate);

// Inicialização
app.listen(ENV.PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${ENV.PORT}`);
  
  // Inicia o Cron Job
  schedule(syncJob);
});