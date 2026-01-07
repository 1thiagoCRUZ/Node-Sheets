import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger.js';
import { now } from '../utils/date.js';
// import { ENV } from '../config/env.js';
// import axios from 'axios';

async function getLocalMockData() {
    try {
        const filePath = path.join(process.cwd(), 'mocks', 'callbox.json');

        try {
            await fs.access(filePath);
        } catch {
            throw new Error(`Arquivo de mock não encontrado em: ${filePath}`);
        }

        const rawData = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(rawData).data;
    } catch (err) {
        logger.error(`Erro ao ler Mock Local: ${err.message}`);
        return null;
    }
}

/* Dps q tiver acesso a API do callbox podemos testar isso aqui abaixo
async function loginCallbox() {
    try {
        logger.info("Realizando autenticação nO Callbox...");
        
        const response = await axios.post(`${ENV.CALLBOX_LOGIN_URL}`, {
            login: ENV.CALLBOX_USER, 
            pass: ENV.CALLBOX_PASS,
            product: "callbox",
            device: "desktop"
        }, {
            headers: { "Content-Type": "application/json" }
        });

        if (response.status !== 200 || !response.data.data) {
             throw new Error("Token inválido.");
        }

        logger.info("Sucesso.");
        return response.data.data;

    } catch (error) {
        logger.error(`Falha na autenticação: ${error.message}`);
        throw error;
    }
}

async function fetchApiData() {
    if (!cachedToken) {
        cachedToken = await loginCallbox();
    }

    try {
        const response = await axios.post(`${ENV.CALLBOX_LOGIN_URL}/reports/calls`, {
        }, {
            headers: {
                'Authorization': `Bearer ${cachedToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data.data;

    } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logger.warn("Token expirado.");
            cachedToken = null;
        }
        throw error;
    }
}
*/

export async function getAllData() {
    const dados = {
        resumo: [],
        analistas: []
    };

    try {
        const rawData = await getLocalMockData();
        // const rawData = await fetchRealApiData();

        if (!rawData) {
            logger.warn("Nenhum dado retornado");
            return dados;
        }

        logger.info("Lendo dados da API...");

        const dataReferencia = rawData.date || new Date().toISOString().split('T')[0];

        if (rawData.summary) {
            dados.resumo.push([
                now(),              // A: Data Hora da Execução
                "CALLBOX",          // B: Fonte
                dataReferencia,     // C: ID (Data do dia)
                rawData.summary.receptivo?.total || 0,
                rawData.summary.ativo?.total || 0,
                rawData.summary.positivo || 0,
                rawData.summary.negativo || 0
            ]);
        }

        if (rawData.agents && Array.isArray(rawData.agents)) {
            rawData.agents.forEach(agente => {
                dados.analistas.push([
                    now(),              // A: Data
                    dataReferencia,     // B: Data Referência
                    agente.name,        // C: Nome do Analista
                    agente.team,        // D: Time/Equipe
                    agente.total_calls, // E: Total Chamadas
                    agente.answered,    // F: Atendidas
                    agente.abandoned,   // G: Abandonadas
                    agente.positive     // H: Positivas
                ]);
            });
        }

    } catch (err) {
        logger.error(`Falha ao processar dados da API: ${err.message}`);
    }

    return dados;
}