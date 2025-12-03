// src/utils/excel.js
const XLSX = require('xlsx');

function rowsToExcelBuffer(rows, sheetName = 'Attendance') {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

module.exports = {
  rowsToExcelBuffer
};
