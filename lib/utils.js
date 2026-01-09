// lib/utils.js

/**
 * Format angka ke dalam format Rupiah.
 * @param {number} v - Nilai angka
 * @returns {string} Format Rupiah (mis. Rp120.000)
 */
export function formatRp(v) {
  if (isNaN(v)) return "Rp0";
  return "Rp" + v.toLocaleString("id-ID");
}
