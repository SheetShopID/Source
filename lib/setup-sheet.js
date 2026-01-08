import { db } from "./firebase-admin";
import { createAndShareSheet } from "./google-sheet";

export async function setupSheetAsync(subdomain) {
  try {
    const shopRef = db.collection("shops").doc(subdomain);

    // buat google sheet
    const sheetUrl = await createAndShareSheet(subdomain);

    // update status → ACTIVE
    await shopRef.update({
      status: "active",
      sheetUrl,
      activatedAt: Date.now(),
    });

  } catch (err) {
    await db.collection("shops").doc(subdomain).update({
      status: "error",
      errorMessage: err.message,
    });
    throw err;
  }
}
