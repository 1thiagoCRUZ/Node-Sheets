import { syncJob } from '../jobs/sync.job.js';
import { logsMemoria } from '../utils/logger.js';

export function getRealtimeLogs(req, res) {
    res.json(logsMemoria);
}

export async function forceSync(req, res) {
    console.log("Gatilho manual acionado");

    logsMemoria.unshift({ 
        time: new Date().toISOString(), 
        level: 'WARNING', 
        msg: 'Sincronização Manual Iniciada' 
    });

    try {
        await syncJob();
        res.json({ message: "Sincronização manual finalizada" });
    } catch (err) {
        res.status(500).json({ error: "Erro crítico ao forçar job." });
    }
}