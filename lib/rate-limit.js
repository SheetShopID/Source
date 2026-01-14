const hits = new Map();

export function rateLimit(key, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const data = hits.get(key) || { count: 0, ts: now };

  if (now - data.ts > windowMs) {
    hits.set(key, { count: 1, ts: now });
    return true;
  }

  if (data.count >= limit) return false;

  data.count++;
  hits.set(key, data);
  return true;
}