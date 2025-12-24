// lib/csv.js

/**
 * Konversi URL Google Sheet ke URL CSV (gid=0)
 * @param {string} url - URL Google Sheet
 * @returns {string} URL CSV siap fetch
 */
export function convertSheetToCSVUrl(url) {
  try {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) return url;
    return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv&gid=0`;
  } catch {
    return url;
  }
}

/**
 * Parse isi CSV menjadi array objek produk.
 * Kolom wajib: name, price, fee, img, category, promo
 * @param {string} text - isi CSV dari Google Sheet
 * @returns {Array<Object>}
 */
export function parseCSV(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const cols = lines[i].split(",");
    const product = {};

    headers.forEach((header, index) => {
      let val = cols[index] ? cols[index].trim() : "";

      if (header === "price" || header === "fee") {
        val = parseInt(val.replace(/\D/g, "")) || 0;
      }

      product[header] = val;
    });

    if (product.name) result.push(product);
  }

  return result;
}
