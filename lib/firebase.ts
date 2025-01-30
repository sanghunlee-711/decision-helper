// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase 설정
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ✅ Firebase 초기화 (중복 방지)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

/** ✅ Google 로그인 & `idToken`을 쿠키에 저장 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    document.cookie = `authToken=${idToken}; path=/; max-age=604800; Secure`;

    return result.user;
  } catch (error) {
    console.error("🔥 로그인 오류:", error);
    alert("로그인 중 오류가 발생했습니다.");
    return null;
  }
};

/** ✅ 로그아웃 */
export const logOut = async () => {
  await signOut(auth);
  document.cookie = "authToken=; path=/; max-age=0;"; // ✅ 쿠키 삭제
};
