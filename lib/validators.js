const RESERVED_SUBDOMAINS = [
  "www",
  "admin",
  "api",
  "root",
  "main",
  "test",
];

export function validateSubdomain(subdomain) {
  if (!subdomain) return false;
  if (subdomain.length < 4) return false;
  if (RESERVED_SUBDOMAINS.includes(subdomain)) return false;

  return /^[a-z0-9-]+$/.test(subdomain);
}

export function validateEmail(email) {
  return typeof email === "string" && email.endsWith("@gmail.com");
}

export function validatePhone(wa) {
  return /^[0-9]{9,15}$/.test(wa);
}
