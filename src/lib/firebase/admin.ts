import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

// Ruta al JSON del service account
const serviceAccountPath = path.resolve("./src/lib/firebase/firebase_key.json");

// Inicializa Firebase Admin si aún no se ha hecho
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL opcional, solo necesario si usas Realtime Database
    // databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });
}

// Exporta Firestore Admin
export const adminDb = admin.firestore();
