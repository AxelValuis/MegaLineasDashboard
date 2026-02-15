export const exportToCsv = <T extends object>(filename: string, rows: T[]): void => {
  if (rows.length === 0) {
    return;
  }

  const headers = Object.keys(rows[0] as object) as (keyof T)[];
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          const clean = String(value ?? '').replace(/"/g, '""');
          return `"${clean}"`;
        })
        .join(','),
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
