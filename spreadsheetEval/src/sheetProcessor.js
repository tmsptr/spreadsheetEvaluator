const { evaluateExpression } = require("./expressionEvaluator");

function processSheets(sheets) {
  const sheetData = {};
  for (const sheet of sheets) {
    const rowData = {};
    for (let rowIndex = 0; rowIndex < sheet.data.length; rowIndex++) {
      const row = sheet.data[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const value = row[colIndex];
        const cellName = String.fromCharCode(colIndex + 65) + (rowIndex + 1);
        rowData[cellName] = value;
      }
    }
    sheetData[sheet.id] = rowData;
  }

  console.log("\n" + "ORIGINAL SHEETDATA:" + "\n");
  console.dir(sheetData);

  for (const sheet of sheets) {
    const data = sheetData[sheet.id];
    for (let rowIndex = 0; rowIndex < sheet.data.length; rowIndex++) {
      const row = sheet.data[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const value = row[colIndex];
        if (typeof value === "string" && value.startsWith("=")) {
          const expression = value.substring(1);
          let evaluatedValue;
          if (/^[A-Z]+\d+$/.test(expression)) {
            evaluatedValue = data[expression];
            while (
              typeof evaluatedValue === "string" &&
              evaluatedValue.startsWith("=")
            ) {
              const recursiveExpression = evaluatedValue.substring(1);
              evaluatedValue = evaluateExpression(recursiveExpression, data);
            }
          } else {
            evaluatedValue = evaluateExpression(expression, data);
          }
          sheet.data[rowIndex][colIndex] = evaluatedValue;
        }
      }
    }
  }

  console.log("\n" + "UPDATED SHEETS:" + "\n");
  console.dir(sheets, { depth: null });

  return sheets;
}

module.exports = {
  processSheets,
};
