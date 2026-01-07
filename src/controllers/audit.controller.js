import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger.js';

const BACKUP_DIR = './backups';

export async function getAuditByDate(req, res) {
    const { date } = req.params;
    
    try {
        try {
            await fs.access(BACKUP_DIR);
        } catch {
            return res.json([]);
        }

        const files = await fs.readdir(BACKUP_DIR);
        const targetFiles = files.filter(file => file.startsWith(date));

        if (targetFiles.length === 0) {
            return res.json([]);
        }

        let combinedData = [];

        for (const file of targetFiles) {
            const filePath = path.join(BACKUP_DIR, file);
            const content = await fs.readFile(filePath, 'utf-8');

            const lines = content.split('\n').filter(line => line.trim() !== '');
            
            lines.forEach(line => {
                try {
                    const jsonBatch = JSON.parse(line);
                    combinedData = combinedData.concat(jsonBatch);
                } catch (err) {
                    logger.warn(`Linha corrompida ignorada no backup ${file}: ${err.message}`);
                }
            });
        }

        return res.json(combinedData);

    } catch (error) {
        logger.error(`Erro ao ler auditoria: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
}