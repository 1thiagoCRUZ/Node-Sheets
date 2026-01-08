import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { ENV } from '../config/env.js';
import { logger } from '../utils/logger.js';


export async function fetchData(config) {
    // Se no .env estiver USE_MOCK=true, ele n tenta acessar a API
    if (process.env.USE_MOCK === 'true') {
        logger.info(`[MOCK] Lendo arquivo: ${config.mockFile}`);
        const filePath = path.resolve(`mocks/${config.mockFile}`);
        
        if (!fs.existsSync(filePath)) throw new Error(`Arquivo Mock não existe: ${filePath}`);
        
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
    } 

    // Para a API
    else {
        logger.info(`[API] Buscando endpoint: ${config.endpoint}`);
        const url = `${ENV.CALLBOX_LOGIN_URL}/${config.endpoint}`;
        
        // Aqui você adicionaria headers de autenticação se necessário
        const response = await axios.get(url);
        return response.data;
    }
}