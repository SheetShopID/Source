import admin from "firebase-admin";

let app;

/**
 * Lazy init Firebase Admin
 * Aman untuk Next.js App Router & Vercel
 */
export function getFirebaseAdmin() {
  if (!app) {
    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error("Missing FIREBASE_PROJECT_ID");
    }
    if (!process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error("Missing FIREBASE_CLIENT_EMAIL");
    }
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error("Missing FIREBASE_PRIVATE_KEY");
    }
    if (!process.env.FIREBASE_DATABASE_URL) {
      throw new Error("Missing FIREBASE_DATABASE_URL");
    }

    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }

  return {
    admin,
    db: app.database(),
  };
}
