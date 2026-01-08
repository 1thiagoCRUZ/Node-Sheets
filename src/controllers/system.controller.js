import { syncJob } from '../jobs/sync.job.js';
import { logger } from '../utils/logger.js';

// export function getRealtimeLogs(req, res) {
//     res.json(logsMemoria);
// }

export async function forceSync(req, res) {
    logger.warn("Gatilho manual de Sincronização acionado via API");
    try {
        await syncJob();
        res.json({ message: "Sincronização manual finalizada com sucesso." });
    } catch (err) {
        logger.error(`Erro crítico ao forçar job: ${err.message}`);
        
        res.status(500).json({ error: "Erro crítico ao forçar job." });
    }
}