import { fetchSourceA } from '../integrations/fonte_de_dadosA/sourceA.client.js';
import { mapSourceA } from '../integrations/fonte_de_dadosA/sourceA.mapper.js';
import { fetchSourceB } from '../integrations/fonte_de_dadosB/sourceB.client.js';
import { mapSourceB } from '../integrations/fonte_de_dadosB/sourceB.mapper.js';

export async function generateReport() {
  const a = mapSourceA(await fetchSourceA());
  const b = mapSourceB(await fetchSourceB());

  return [...a, ...b];
}
