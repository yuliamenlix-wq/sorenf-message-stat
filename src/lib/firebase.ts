import { initializeApp, cert } from "firebase-admin/app";
import type { ServiceAccount } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Carga la clave desde env
const firebaseConfig: ServiceAccount = JSON.parse(
  process.env.FIREBASE_KEY_JSON || "{}"
);

const app = initializeApp({
  credential: cert(firebaseConfig),
});

export const db = getFirestore(app);

export const users_col = db.collection("users");
export const streams_col = db.collection("streams");
export const messages_col = db.collection("messages");
export const reward_requests_col = db.collection("reward_requests");
