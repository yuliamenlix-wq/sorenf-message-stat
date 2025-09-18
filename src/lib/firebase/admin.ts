import admin from "firebase-admin";

import 'dotenv/config';

if (!admin.apps.length) {
  if (!process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("Missing Firebase env variables");
  }

  const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };

  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}

export const adminDb = admin.firestore();
