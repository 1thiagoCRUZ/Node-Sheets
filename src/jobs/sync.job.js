import { getAllData } from '../services/api.service.js';
import { saveToSheets, getExistingIds } from '../services/sheets.service.js';
import { saveBackup } from '../services/backup.service.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import { executionHistory } from '../app.js';

export async function syncJob() {
  if (!acquireLock()) {
    console.log("Job bloqueado -> Uma execução já está em andamento.");
    return;
  }

  const startTime = new Date();
  let status = 'Sucesso';
  let details = '';
  
  let countCallboxTotal = 0;
  let countCallboxNovos = 0;
  let countOctaTotal = 0;
  let countOctaNovos = 0;

  try {
    console.info("[INICIANDO SINCRONIZAÇÃO]");
    const todosDados = await getAllData();
    
    const dadosApiCallbox = todosDados.filter(linha => linha[1] === 'CALLBOX');
    const dadosApiOcta = todosDados.filter(linha => linha[1] === 'OCTA');

    countCallboxTotal = dadosApiCallbox.length;
    countOctaTotal = dadosApiOcta.length;

    if (dadosApiCallbox.length > 0) {
      // 1. backup frio
      await saveBackup(dadosApiCallbox, 'Callbox');

      // 2. Lógica do Hot Storage (Filtra duplicados)
      const idsExistentes = await getExistingIds('Callbox');
      const novosCallbox = dadosApiCallbox.filter(linha => !idsExistentes.includes(String(linha[2])));

      if (novosCallbox.length > 0) {
        await saveToSheets(novosCallbox, 'Callbox');
        countCallboxNovos = novosCallbox.length; // Registra quantos salvou
      }
    }

    if (dadosApiOcta.length > 0) {
      // 1. backup frio
      await saveBackup(dadosApiOcta, 'Octa');

      // 2. Hot Storage
      const idsExistentes = await getExistingIds('Octa');
      const novosOcta = dadosApiOcta.filter(linha => !idsExistentes.includes(String(linha[2])));

      if (novosOcta.length > 0) {
        await saveToSheets(novosOcta, 'Octa');
        countOctaNovos = novosOcta.length; // Registra quantos salvou
      }
    }

    details = `Callbox: ${countCallboxTotal} lidos (${countCallboxNovos} novos). Octa: ${countOctaTotal} lidos (${countOctaNovos} novos).`;
    
  } catch (err) {

    console.error("Erro no processo:", err);
    status = 'Erro';
    details = err.message;

  } finally {
    releaseLock();

    if (executionHistory) {
      executionHistory.unshift({
        time: startTime.toISOString(),
        status: status,
        details: details
      });

      if (executionHistory.length > 20) {
        executionHistory.pop();
      }
    }
  }
}