const { Workbook } = require('exceljs');

const ExcelTransform = config => {
  const addWorksheet = (workbook, sheetDef) => {
    const worksheet = workbook.addWorksheet(sheetDef.name || sheetDef.key);
    const header = sheetDef.columns.map(({ key, heading }) => heading || key);
    worksheet.addRow(header);
    return worksheet;
  };

  const addRows = (worksheet, sheetDef, items) => {
    worksheet.addRows(items.map(item => sheetDef.columns.map(({ key }) => item[key])));
  };

  return {
    parse: buf => JSON.parse(buf),
    dump: obj => {
      const workbook = new Workbook();
      config.sheets.forEach(sheet => {
        const worksheet = addWorksheet(workbook, sheet);
        addRows(worksheet, sheet, obj[sheet.key]);
      });
      const buf = workbook.xlsx.writeBuffer();
      return buf;
    },
  };
};

module.exports = ExcelTransform;
