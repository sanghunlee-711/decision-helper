/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, logOut, auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log({user})
      setUser(currentUser);
      if (currentUser) {
        await currentUser.getIdToken(); // ✅ 로그인 후 `idToken`을 가져와야 쿠키가 정상 저장됨
        router.push("/dashboard"); // ✅ 로그인 후 페이지 이동
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="p-6 shadow-lg w-[350px]">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">로그인</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {user ? (
            <>
              <p className="text-center text-gray-600">로그인됨: {user.displayName}</p>
              <Button variant="outline" onClick={logOut}>로그아웃</Button>
            </>
          ) : (
            <Button className="bg-blue-600 text-white" onClick={signInWithGoogle}>
              Google 로그인
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
