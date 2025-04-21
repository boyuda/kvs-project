import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportToExcel(dataBySheet) {
  const workbook = XLSX.utils.book_new();

  for (const sheetName in dataBySheet) {
    const data = dataBySheet[sheetName];
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  const now = new Date();
  const formattedDate = now
    .toISOString()
    .replace(/T/, '_')
    .replace(/:/g, '-')
    .slice(0, 16);

  const fileName = `${formattedDate}_ataskaita.xlsx`;

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(blob, fileName);
}
