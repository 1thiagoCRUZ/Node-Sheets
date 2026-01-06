import fs from 'fs/promises';
import path from 'path';

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
    console.log(`[BACKUP] - Backup salvo em: ${filename}`);
  } catch (err) {
    console.error("Erro ao salvar backup físico:", err);
  }
}