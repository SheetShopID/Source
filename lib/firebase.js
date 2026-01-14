const FIREBASE_BASE =
  "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";

/**
 * Ambil data dari Firebase Realtime Database
 * @param {string} path - Path Firebase, misal "shops/shop123"
 * @returns {Promise<any>}
 */
export async function firebaseGet(path) {
  try {
    const res = await fetch(`${FIREBASE_BASE}/${path}.json`);
    if (!res.ok) throw new Error(`Firebase GET gagal: ${res.statusText}`);
    return res.json();
  } catch (err) {
    console.error("[FIREBASE GET ERROR]", err);
    throw err;
  }
}

/**
 * Push data baru ke Firebase
 * @param {string} path - Path Firebase
 * @param {any} data - Data JSON
 * @returns {Promise<any>}
 */
export async function firebasePush(path, data) {
  try {
    const res = await fetch(`${FIREBASE_BASE}/${path}.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Firebase PUSH gagal: ${res.statusText}`);
    return res.json();
  } catch (err) {
    console.error("[FIREBASE PUSH ERROR]", err);
    throw err;
  }
}

/**
 * Update / replace data di Firebase
 * @param {string} path - Path Firebase
 * @param {any} data - Data JSON
 * @returns {Promise<any>}
 */
export async function firebasePut(path, data) {
  try {
    const res = await fetch(`${FIREBASE_BASE}/${path}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Firebase PUT gagal: ${res.statusText}`);
    return res.json();
  } catch (err) {
    console.error("[FIREBASE PUT ERROR]", err);
    throw err;
  }
}

/**
 * Hapus data di Firebase
 * @param {string} path - Path Firebase
 * @returns {Promise<any>}
 */
export async function firebaseDelete(path) {
  try {
    const res = await fetch(`${FIREBASE_BASE}/${path}.json`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error(`Firebase DELETE gagal: ${res.statusText}`);
    return res.json();
  } catch (err) {
    console.error("[FIREBASE DELETE ERROR]", err);
    throw err;
  }
}
