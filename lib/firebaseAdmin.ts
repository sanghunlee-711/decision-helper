// lib/firebaseAdmin.ts
import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Firebase Admin SDK 초기화
if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // 개행문자 처리
    }),
  });
}
export const adminAuth = getAuth(); // ✅ Firebase Admin 인증 객체
export const adminDb = admin.firestore();
