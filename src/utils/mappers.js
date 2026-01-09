import { now, timeToSeconds } from "./date.js";

const safe = (val) => val || '-';

export const MAPPERS = {
    // Transforma o que vier em um array
    // Para as chamadas
    listaChamadas: (json) => {
        const lista = json.data.result || [];

        return lista.filter(item => timeToSeconds(item.duration) >= 30)
            .map(item => [
                safe(item.date),
                safe(item.nameAgent),
                safe(item.destiny),
                safe(item.status),
                safe(item.duration)
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

    // Para as informações das pausas
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

    // Dados gerais do callcenter, por causa do date n ta funfando provavelmente
    resumoReceptivos: (json) => {
        const data = json.data || {};
        const receptivo = data.receptivo || {};
        const dataHoje = now().split('T')[0];

        const linha = [
            dataHoje,                           // A: Data Hoje
            safe(receptivo.totalRegistrosReceptivos),  // B: Total Efetuadas
            safe(receptivo.totalAtendidas),// C: Completadas
            safe(receptivo.totalAbandonadas),    // D: Atendidas Entrantes
            safe(receptivo.tempoMedioEspera), // E: Perdidas Entrantes
            safe(receptivo.nivelServico)
        ];
        return [linha];
    },

    resumoAtendidas: (json) => {
        const lista = json.data.result || [];
        return lista.map(item => [
            safe(item.date),           // Coluna A: Data
            safe(item.groupCallcenter),       // Coluna B: Grupo
            safe(item.agent),          // Coluna C: ID agente
            safe(item.nameAgent),       // Coluna D: Nome
            safe(item.waitingTime),       // Coluna E: Tempo espera
            safe(item.serviceTime),         // Coluna F: Duração
            safe(item.status)     // Coluna G: Status
        ]);
    }
};