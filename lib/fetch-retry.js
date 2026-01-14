export async function fetchRetry(url, options, retry = 2) {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (retry <= 0) throw err;
    return fetchRetry(url, options, retry - 1);
  }
}
