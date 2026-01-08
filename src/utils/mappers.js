import { now } from "./date.js";

const safe = (val) => val || '-';

export const MAPPERS = {
    // Transforma o que vier em um array
    // Para as chamadas
    listaChamadas: (json) => {
        const lista = json.data.result || [];
        return lista.map(item => [
            safe(item.date),            // A: Data
            safe(item.nameAgent),       // B: Agente
            safe(item.destiny),         // C: Telefone
            safe(item.status),          // D: Status 
            safe(item.duration)         // E: Duração
        ]);
    },

    listaChamadasPerdidas: (json) => {
        const lista = json.data.result || [];
        return lista.map(item => [
            safe(item.date),            // A: Data
            safe(item.agentName),       // B: Agente 
            safe(item.origin),          // C: Telefone
            "Perdida",                  // D: Status -> padrao assim ja q e perdida
            safe(item.time)             // E: Duração 
        ]);
    },

    // Para as informações das pauas
    listaPausas: (json) => {
        const lista = json.data.result || [];
        return lista.map(item => [
            safe(item.agent),           // Coluna A: ID Agente
            safe(item.nameAgent),       // Coluna B: Nome
            safe(item.action),          // Coluna C: Tipo (Login, Pausa)
            safe(item.startDate),       // Coluna D: Inicio
            safe(item.endDate),         // Coluna E: Fim
            safe(item.durationTime)     // Coluna F: Duração
        ]);
    },

    // Para resumo por agente
    resumoAgente: (json) => {
        const objeto = json.data.result || {};
        return Object.values(objeto).map(item => [
            safe(item.date),            // A: Data Ref
            safe(item.agent),           // B: ID
            safe(item.agentName),       // C: Nome
            safe(item.totalEfetuadas),  // D: Efetuadas
            safe(item.totalAtendidas),  // E: Atendidas
            safe(item.totalPerdidasChamadas) // F: Perdidas
        ]);
    },

    // Dados gerais do callcenter
    resumoGeral: (json) => {
        const r = json.data.result || {};
        const dataHoje = now().split('T')[0];

        const linha = [
            dataHoje,                           // A: Data Hoje
            safe(r.saida?.chamadas_efetuadas),  // B: Total Efetuadas
            safe(r.saida?.chamadas_completadas),// C: Completadas
            safe(r.entrada?.totalAtendidas),    // D: Atendidas Entrantes
            safe(r.entrada?.totalPerdidasChamadas) // E: Perdidas Entrantes
        ];
        return [linha];
    }
};