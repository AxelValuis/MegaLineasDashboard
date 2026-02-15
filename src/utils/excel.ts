import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { PlanItem } from '../api/types';

interface PlanificadorFilters {
  startDate: string;
  endDate: string;
  category: string;
  product: string;
}

const RED = 'FFD50000';
const BLUE = 'FF1F4F8A';
const LIGHT_GRAY = 'FFF5F7FA';

const safeText = (value: string): string => value.trim() || '-';

const fetchLogoAsBase64 = async (): Promise<string | null> => {
  try {
    const response = await fetch('/logo-megalineas.png');
    if (!response.ok) {
      return null;
    }
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        resolve(result.includes(',') ? result.split(',')[1] : null);
      };
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

export const exportPlanificadorExcel = async (rows: PlanItem[], filters: PlanificadorFilters): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Planificador');

  sheet.columns = [
    { key: 'c1', width: 18 },
    { key: 'c2', width: 24 },
    { key: 'c3', width: 24 },
    { key: 'c4', width: 18 },
    { key: 'c5', width: 22 },
    { key: 'c6', width: 36 },
  ];

  const logoBase64 = await fetchLogoAsBase64();
  if (logoBase64) {
    const imageId = workbook.addImage({
      base64: logoBase64,
      extension: 'png',
    });
    sheet.addImage(imageId, {
      tl: { col: 0, row: 0 },
      ext: { width: 250, height: 70 },
    });
  } else {
    sheet.mergeCells('A1:C2');
    const cell = sheet.getCell('A1');
    cell.value = 'MEGALINEAS';
    cell.font = { bold: true, size: 18, color: { argb: BLUE } };
  }

  sheet.mergeCells('D1:F2');
  const reportTitleCell = sheet.getCell('D1');
  reportTitleCell.value = 'REPORTE PLANIFICADOR DE PATCHING';
  reportTitleCell.font = { bold: true, size: 14, color: { argb: BLUE } };
  reportTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  sheet.getCell('A4').value = 'Filtros seleccionados';
  sheet.getCell('A4').font = { bold: true, color: { argb: BLUE } };

  const filtersRows: Array<[string, string]> = [
    ['Fecha inicio', safeText(filters.startDate)],
    ['Fecha fin', safeText(filters.endDate)],
    ['Categoria', safeText(filters.category || 'Todas')],
    ['Producto', safeText(filters.product || 'Todos')],
  ];

  filtersRows.forEach(([name, value], index) => {
    const rowNumber = 5 + index;
    sheet.getCell(`A${rowNumber}`).value = name;
    sheet.getCell(`A${rowNumber}`).font = { bold: true };
    sheet.getCell(`B${rowNumber}`).value = value;
    sheet.getCell(`B${rowNumber}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: LIGHT_GRAY },
    };
  });

  const headerRowNumber = 10;
  const headers = ['Fecha', 'Articulo', 'Producto', 'Estado', 'Responsable', 'Observacion'];
  headers.forEach((header, index) => {
    const cell = sheet.getCell(headerRowNumber, index + 1);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: RED },
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  rows.forEach((row, idx) => {
    const rowNumber = headerRowNumber + 1 + idx;
    const values = [row.fecha, row.item, row.producto, row.estado, row.responsable, row.observacion];
    values.forEach((value, colIndex) => {
      sheet.getCell(rowNumber, colIndex + 1).value = value;
    });
  });

  const lastRow = Math.max(headerRowNumber + rows.length, headerRowNumber + 1);
  for (let r = headerRowNumber; r <= lastRow; r += 1) {
    for (let c = 1; c <= 6; c += 1) {
      const cell = sheet.getCell(r, c);
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        right: { style: 'thin', color: { argb: 'FFDDDDDD' } },
      };
      if (r > headerRowNumber) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: r % 2 === 0 ? 'FFFFFFFF' : 'FFF9FBFD' },
        };
      }
    }
  }

  sheet.views = [{ state: 'frozen', ySplit: headerRowNumber }];
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), 'planificador.xlsx');
};
