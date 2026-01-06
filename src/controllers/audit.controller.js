import fs from 'fs/promises';
import path from 'path';

const BACKUP_DIR = './backups';

export async function getAuditByDate(req, res) {
    const { date } = req.params;
    
    try {
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
                    console.error("Linha corrompida ignorada:", err);
                }
            });
        }

        return res.json(combinedData);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}