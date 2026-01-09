import { fetchData } from '../services/data.service.js';
import { upsertData } from '../services/sheets.service.js';
import { MAPPERS } from '../utils/mappers.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import { logger } from '../utils/logger.js';

const TASKS = [
  {
    name: 'Efetuadas',
    endpoint: 'relatorios/callcenter/tab_efetuadas',
    mockFile: 'efetuadas.json',
    sheetName: 'Efetuadas',
    mapper: 'listaChamadas',
    keyIndex: 0 // Usa Data como chave
  },
  {
    name: 'Perdidas',
    endpoint: 'relatorios/agentes/tab_perdidas',
    mockFile: 'perdidas.json',
    sheetName: 'Perdidas',
    mapper: 'listaChamadasPerdidas',
    keyIndex: 0
  },
  {
    name: 'Analistas',
    endpoint: 'relatorios/agentes/tab_resumo_por_agente',
    mockFile: 'resumoporagente.json',
    sheetName: 'Analistas',
    mapper: 'resumoAgente',
    keyIndex: 1 // Usa ID do Agente como chave
  },
  {
    name: 'Pausas',
    endpoint: 'relatorios/agentes/tab_login_pausas',
    mockFile: 'pausaslogin.json',
    sheetName: 'Pausas',
    mapper: 'listaPausas',
    keyIndex: 3 // Usa Data de Início
  },
  {
    name: 'Resumo_Receptivos',
    endpoint: 'relatorios/callcenter',
    mockFile: 'resumos.json',
    sheetName: 'Resumo_Receptivos',
    mapper: 'resumoReceptivos',
    keyIndex: 0 // Usa Data de Hoje
  },
  {
    name: 'Atendidas',
    endpoint: 'relatorios/agentes/tab_atendidas',
    mockFile: 'resumos.json',
    sheetName: 'Atendidas',
    mapper: 'resumoAtendidas',
    keyIndex: 0
  }
];

export const executionHistory = [];

export async function syncJob() {
  if (!acquireLock()) return;

  const startTime = new Date();
  let details = '';

  try {
    logger.info("[JOB] Iniciando Sync...");

    for (const task of TASKS) {
      try {
        const jsonData = await fetchData(task);

        const rows = MAPPERS[task.mapper](jsonData);

        if (!rows || rows.length === 0) {
          logger.warn(`[${task.name}] Sem dados para sincronizar.`);
          continue;
        }

        const result = await upsertData(rows, task.sheetName, task.keyIndex);

        const logMsg = `[${task.name}: +${result.added}/Upd${result.updated}]`;
        logger.info(logMsg);
        details += logMsg + ' ';

      } catch (taskError) {
        logger.error(`[ERRO] - Falha em ${task.name}: ${taskError.message}`);
        details += `[${task.name}: FALHA] `;
      }
    }

    logger.info(`Fim do Job.`);

  } catch (err) {
    logger.error(`Erro Crítico no Job: ${err.message}`);
  } finally {
    releaseLock();

    const duration = ((new Date() - startTime) / 1000).toFixed(2);
    logger.info(`Job finalizado em ${duration}s. Detalhes: ${details}`);
    executionHistory.unshift({
      time: startTime.toISOString(),
      duration: `${duration}s`,
      details: details
    });
    if (executionHistory.length > 50) executionHistory.pop();
  }
}