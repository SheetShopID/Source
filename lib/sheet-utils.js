export function convertSheetToCSVUrl(sheetUrl) {
  if (!sheetUrl) throw new Error("Sheet URL kosong");

  const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) throw new Error("Sheet URL tidak valid");

  return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
}
