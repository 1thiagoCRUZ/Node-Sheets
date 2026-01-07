import { logger } from './logger.js';

export async function retry(fn, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
      logger.warn(`Falha na tentativa ${i + 1}/${attempts}. Retentando em 2s... (${err.message})`);
      
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}