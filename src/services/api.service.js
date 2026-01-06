import axios from 'axios';
import { now } from '../utils/date.js';

async function fetchCallbox() {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
  
  return data.slice(0, 5).map(item => [
    now(),              // Coluna A: Data Coleta
    "CALLBOX",          // Coluna B: Fonte
    item.id,            // Coluna C: ID Externo
    item.title,         // Coluna D: Nome/Titulo
    "Status: Novo"      // Coluna E: Detalhe (Mockado)
  ]);
}

async function fetchOcta() {
  // Simulando Octa (Users)
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');

  return data.slice(0, 5).map(item => [
    now(),              // Coluna A
    "OCTA",             // Coluna B
    item.id,            // Coluna C
    item.name,          // Coluna D
    item.email          // Coluna E 
  ]);
}

export async function getAllData() {
  const callboxData = await fetchCallbox();
  const octaData = await fetchOcta();
  return [...callboxData, ...octaData];
}