import { getSheetsClient } from '../config/google.js';
import { ENV } from '../config/env.js';

export async function upsertData(rows, sheetName, keyIndex = 0) {
    const client = getSheetsClient();
    
    const response = await client.spreadsheets.values.get({
        spreadsheetId: ENV.GOOGLE_SHEETS_ID,
        range: `${sheetName}!A:Z`, 
    });

    const existingRows = response.data.values || [];
    const updates = []; // Lista para atualizar
    const appends = []; // Lista para append
    const rowMap = new Map();

    existingRows.forEach((row, index) => {
        if (index === 0) return;
        
        const key = String(row[keyIndex] || '').trim();
        
        if (key) rowMap.set(key, { rowIndex: index + 1, data: row });
    });

    for (const newRow of rows) {
        const formattedNewRow = newRow.map(cell => (cell === null || cell === undefined) ? '' : String(cell));
        
        const key = formattedNewRow[keyIndex];
        const existing = rowMap.get(key);

        if (existing) {
            const currentStr = existing.data.join('|');
            const newStr = formattedNewRow.join('|');

            if (currentStr !== newStr) {
                updates.push({
                    range: `${sheetName}!A${existing.rowIndex}`, // Atualiza a linha exata
                    values: [formattedNewRow]
                });
            }
        } else {
            appends.push(formattedNewRow);
        }
    }

    if (updates.length > 0) {
        await client.spreadsheets.values.batchUpdate({
            spreadsheetId: ENV.GOOGLE_SHEETS_ID,
            resource: {
                valueInputOption: 'USER_ENTERED',
                data: updates
            }
        });
    }

    if (appends.length > 0) {
        await client.spreadsheets.values.append({
            spreadsheetId: ENV.GOOGLE_SHEETS_ID,
            range: `${sheetName}!A:A`,
            valueInputOption: 'USER_ENTERED',
            resource: { values: appends }
        });
    }

    return { updated: updates.length, added: appends.length };
}

export function getSheetsClientWrapper() {
     return getSheetsClient();
}