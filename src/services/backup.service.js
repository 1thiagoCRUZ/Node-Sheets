import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger.js';

const BACKUP_DIR = './backups';

async function ensureDir() {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR);
  }
}

export async function saveBackup(data, sourceName) {
  await ensureDir();

  const today = new Date().toISOString().split('T')[0];
  const filename = `${today}-${sourceName}.jsonl`;
  const filePath = path.join(BACKUP_DIR, filename);

  try {
    const content = JSON.stringify(data) + '\n';
    
    await fs.appendFile(filePath, content);
    logger.info(`[BACKUP] Salvo em: ${filename}`);
  } catch (err) {
    logger.error(`Erro ao salvar backup físico: ${err.message}`);
  }
}