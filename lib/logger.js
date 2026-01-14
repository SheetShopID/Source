// app/lib/logger.js .
export const ALLOWED_LEVELS = ["info", "warn", "error"];
const FIREBASE_BASE =
  "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";

export async function log(
  label,
  data = {},
  requestId = null,
  level = "info",
  source = "api"
) {
  try {
    const logLevel = ALLOWED_LEVELS.includes(level) ? level : "info";
    const payload = {
      ts: new Date().toISOString(),
      level: logLevel,
      label: label || "UNKNOWN",
      data,
      requestId: requestId || crypto.randomUUID(),
      source,
    };

    const res = await fetch(`${FIREBASE_BASE}/logs.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to write log to Firebase");

    return payload;
  } catch (err) {
    console.error("[LOGGER ERROR]", err);
    return null;
  }
}

