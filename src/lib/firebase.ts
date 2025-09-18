import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

// Ruta al JSON
const serviceAccountPath = path.resolve("./src/lib/firebase_key.json");

// Solo inicializa si no está ya
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
