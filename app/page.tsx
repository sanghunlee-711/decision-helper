import { cookies } from "next/headers";
import { HomeClient } from "@/components/HomeClient";

async function checkCookie() {
  // 서버에서 쿠키 가져오기
  const cookieStore =  await cookies();
  const authToken = cookieStore.get("authToken");

  return authToken;
}

export default async function Home() {
  const authToken =   await checkCookie();

  return (
    <HomeClient authToken={authToken} />
  );
}
