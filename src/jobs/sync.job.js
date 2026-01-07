import { getAllData } from '../services/api.service.js';
import { saveToSheets, getExistingIds } from '../services/sheets.service.js';
import { saveBackup } from '../services/backup.service.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import { logger } from '../utils/logger.js';
import { ENV } from '../config/env.js';

export const executionHistory = [];

export async function syncJob() {
  if (!acquireLock()) {
    logger.warn("Job bloqueado -> Uma execução já está em andamento.");
    return;
  }

  const startTime = new Date();
  let status = 'Sucesso';
  let details = '';

  try {
    logger.info("[JOB] Iniciando Sincronização...");

    const pacoteDados = await getAllData();

    let salvouResumo = false;
    
    if (pacoteDados.resumo && pacoteDados.resumo.length > 0) {
      await saveBackup(pacoteDados.resumo, 'Resumo');

      const idsExistentes = await getExistingIds(ENV.SHEET_NAME_RESUMO);

      const resumoNovo = pacoteDados.resumo.filter(linha => !idsExistentes.includes(String(linha[2])));

      if (resumoNovo.length > 0) {
        await saveToSheets(resumoNovo, ENV.SHEET_NAME_RESUMO);
        salvouResumo = true;
        details += `Resumo diário salvo. `;
      } else {
        details += `Resumo já existe (dia atual ignorado). `;
      }
    }
    if (salvouResumo && pacoteDados.analistas && pacoteDados.analistas.length > 0) {
        
        await saveBackup(pacoteDados.analistas, 'Analistas');
        
        await saveToSheets(pacoteDados.analistas, ENV.SHEET_NAME_ANALISTAS);
        
        details += `Detalhe de ${pacoteDados.analistas.length} analistas salvo.`;
    } else if (!salvouResumo && pacoteDados.analistas.length > 0) {
        details += `Analistas ignorados (já salvos hoje).`;
    }

    logger.info(`Fim do Job. ${details}`);

  } catch (err) {
    logger.error(`Erro no Job: ${err.message}`);
    status = 'Erro';
    details = err.message;

  } finally {
    releaseLock();

    executionHistory.unshift({
      time: startTime.toISOString(),
      status: status,
      details: details
    });

    if (executionHistory.length > 50) executionHistory.pop();
  }
}