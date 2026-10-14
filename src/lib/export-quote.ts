import type { Quote } from './quote';

export async function makeQuoteExcel(quote: Quote, language: 'zh' | 'ru') {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(language === 'zh' ? '报价单' : 'Предложение');
  sheet.addRow(['AyingAI', language === 'zh' ? '报价单' : 'Коммерческое предложение']);
  sheet.addRow([language === 'zh' ? '客户公司' : 'Компания', quote.company]);
  sheet.addRow([language === 'zh' ? '币种' : 'Валюта', quote.currency]);
  sheet.addRow([]);
  sheet.addRow(language === 'zh' ? ['品名', '规格', '数量', '单价', '总价'] : ['Наименование', 'Характеристики', 'Количество', 'Цена', 'Сумма']);
  quote.products.forEach(p => sheet.addRow([p.name, p.specification, p.quantity, p.unitPrice, p.total]));
  sheet.addRow([]);
  sheet.addRow([language === 'zh' ? '注意事项' : 'Примечания']);
  quote.notes.forEach(note => sheet.addRow([note]));
  sheet.columns = [{ width: 32 }, { width: 40 }, { width: 18 }, { width: 18 }, { width: 20 }];
  sheet.eachRow(row => { row.font = { name: 'Arial', size: 11 }; row.alignment = { vertical: 'middle', wrapText: true }; row.height = 28; });
  sheet.getRow(1).font = { name: 'Arial', bold: true, size: 18 };
  sheet.getRow(5).font = { name: 'Arial', bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF193158' } };
  for (let n = 6; n < 6 + quote.products.length; n++) { sheet.getCell(n, 4).numFmt = '#,##0.00'; sheet.getCell(n, 5).numFmt = '#,##0.00'; }
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([new Uint8Array(buffer)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
export function downloadQuote(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}