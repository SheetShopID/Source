const FIREBASE_BASE =
  "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com";

export async function firebasePush(path, data) {
  const res = await fetch(`${FIREBASE_BASE}/${path}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Firebase push gagal");
  }

  return res.json();
}

// Ambil data dari Firebase
export async function firebaseGet(path) {
  const res = await fetch(`${FIREBASE_BASE}/${path}.json`);
  if (!res.ok) {
    throw new Error("Firebase get gagal");
  }
  return res.json();
}
