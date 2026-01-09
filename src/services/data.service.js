import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { ENV } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { now } from '../utils/date.js';

let cachedToken = null;


async function getAuthToken() {
    if (cachedToken) return cachedToken;

    try {
        logger.info("Autenticando na API...");
        const response = await axios.post(`${ENV.CALLBOX_LOGIN_URL}`, {
            login: ENV.CALLBOX_USER,
            pass: ENV.CALLBOX_PASS,
            product: "callbox",
            device: "desktop"
        });

        if (response.data && response.data.data) {
            console.log("token:", response.data.data);
            cachedToken = response.data.data;
            // console.log(cachedToken);
            return cachedToken;
        } else {
            throw new Error("Token não retornado pela API.");
        }
    } catch (error) {
        logger.error(`Erro na Autenticação: ${error.message}`);
        throw error;
    }
}

export async function fetchData(task) {
    if (process.env.USE_MOCK === 'true') {
        const filePath = path.resolve(`mocks/${task.mockFile}`);

        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`Mock não encontrado: ${task.mockFile}`);
            }
            logger.info(`[MOCK] Lendo: ${task.mockFile}`);
            const rawData = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(rawData);
        } catch (err) {
            logger.error(`Erro ao ler mock: ${err.message}`);
            return { data: { result: [] } };
        }
    }

    else {
        try {
            const token = await getAuthToken();

            logger.info(`[API] Buscando: ${task.endpoint}`);
            const dataHoje = now().split('T')[0];

            const response = await axios.post(`${ENV.PREFIX_URL}/${task.endpoint}`, {
                    filter_start_date: "2026-01-01",
                    filter_end_date: dataHoje,
                }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;

        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logger.warn("Token expirado. Será renovado na próxima execução.");
                cachedToken = null;
            }
            throw error;
        }
    }
}