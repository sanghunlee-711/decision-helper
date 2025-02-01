// app/menu/page.tsx (서버 컴포넌트)
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { MenuData } from "@/types/menu";
import MenuClient from "@/components/MenuClient";
import { cookies } from "next/headers";
import { getEmailUsername } from "@/utils/email";

async function fetchMenus(uid: string): Promise<MenuData> {
  const docRef = adminDb.collection("menus").doc(uid);
  const snapshot = await docRef.get();
  return snapshot.exists ? (snapshot.data() as MenuData) : { categories: [] };
}

export default async function MenuPage() {
  const cookieStore = await cookies();
  const idToken = cookieStore.get("authToken")?.value;

  if (!idToken) {
    return <p className="text-center text-red-500">로그인이 필요합니다.</p>;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken); // ✅ `idToken` 검증 후 `uid` 가져오기
    const user = await adminAuth.getUser(decodedToken.uid)
    const menus = await fetchMenus(getEmailUsername(user.email || '')); // ✅ 유저별 데이터 불러오기
    
    if(!user.email) {
      return <p className="text-center text-red-500">알 수 없는 유저입니다.</p>;
    }
    return <MenuClient initialMenus={menus} email={user.email} />;
  } catch (error) {
    console.error("로그인 검증 실패:", error);
    return <p className="text-center text-red-500">로그인 세션이 만료되었습니다. 다시 로그인하세요.</p>;
  }
}
