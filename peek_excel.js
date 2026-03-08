import xlsx from 'xlsx';
import fs from 'fs';

try {
    const file = 'estado del emprendimiento.xlsx';
    const workbook = xlsx.readFile(file);
    const data = {};

    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        data[sheetName] = json.slice(0, 5); // Just peek at first 5 rows
    }

    console.log(JSON.stringify(data, null, 2));
} catch (err) {
    console.error(err);
}
