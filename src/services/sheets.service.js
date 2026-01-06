import { getSheetsClient } from '../config/google.js';
import { ENV } from '../config/env.js';

export async function getExistingIds(sheetName) {
  const client = getSheetsClient();
  try {
    const response = await client.spreadsheets.values.get({
      spreadsheetId: ENV.GOOGLE_SHEETS_ID,
      range: `${sheetName}!C:C`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    return rows.flat().map(id => String(id));
  } catch (error) {
    console.error(`Erro ao ler IDs de ${sheetName}:`, error.message);
    return [];
  }
}

export async function saveToSheets(rows, sheetName) {
  const client = getSheetsClient(); 
  
  const values = rows.map(r => {
      const arrayRow = Array.isArray(r) ? r : Object.values(r);
      return arrayRow.map(cell => String(cell)); 
  });

  try {
      await client.spreadsheets.values.append({
        spreadsheetId: ENV.GOOGLE_SHEETS_ID,
        range: `${sheetName}!A1`, 
        valueInputOption: 'USER_ENTERED',
        requestBody: { values }
      });
      console.log(`[SUCCESS] - ✅ ${rows.length} novos itens salvos em ${sheetName}`);
  } catch (error) {
      console.error(`Erro ao salvar em ${sheetName}:`, error.message);
  }
}