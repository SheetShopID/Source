const cache = {};
const TTL = 60_000; // 1 menit

export function getCache(key) {
  const item = cache[key];
  if (!item) return null;
  if (Date.now() - item.ts > TTL) return null;
  return item.data;
}

export function setCache(key, data) {
  cache[key] = { ts: Date.now(), data };
}
