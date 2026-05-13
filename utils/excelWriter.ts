import * as XLSX from 'xlsx';
import * as fs from 'fs';

export function writeToExcel(
    filePath: string,
    sheetName: string,
    newRow: Record<string, any>
) {
    let workbook;
    let data: any[] = [];

    if (fs.existsSync(filePath)) {
        workbook = XLSX.readFile(filePath);

        if (workbook.Sheets[sheetName]) {
            data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // 🔥 REMOVE OLD SHEET (IMPORTANT)
            delete workbook.Sheets[sheetName];

            // Also remove from SheetNames array
            workbook.SheetNames = workbook.SheetNames.filter(
                name => name !== sheetName
            );
        }
    } else {
        workbook = XLSX.utils.book_new();
    }

    // Add new row
    data.push(newRow);

    const newSheet = XLSX.utils.json_to_sheet(data);

    // Append fresh sheet
    XLSX.utils.book_append_sheet(workbook, newSheet, sheetName);

    XLSX.writeFile(workbook, filePath);
}