export function convertSheetToCSVUrl(sheetUrl) {
  const id = sheetUrl.match(/\/d\/(.+?)\//)?.[1];
  if (!id) throw new Error("Sheet URL invalid");
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`;
}

export function parseCSV(text) {
  const lines = text.split("\n").filter(Boolean);
  const headers = lines.shift().split(",").map(h => h.trim());

  return lines.map(line => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i]?.trim() || "";
    });
    return obj;
  });
}
