"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { auth, logOut } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [isMenuPending, startMenuTransition] = useTransition();
  const [isQuestionsPending, startQuestionsTransition] = useTransition();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-6 shadow-lg w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">대시보드</CardTitle>
          </CardHeader>
          <div className="flex flex-col gap-[12px] mb-[12px]">
        <Button
          variant="outline"
          onClick={() => startMenuTransition(() => router.push("/menu"))}
          disabled={isMenuPending}
        >
          {isMenuPending ? <Loader2 className="animate-spin mr-2" /> : "메뉴등록 페이지 가기"}
        </Button>
        <Button
          variant="outline"
          onClick={() => startQuestionsTransition(() => router.push("/questions"))}
          disabled={isQuestionsPending}
        >
          {isQuestionsPending ? <Loader2 className="animate-spin mr-2" /> : "질문등록 페이지 가기"}
        </Button>
        </div>
          <CardContent className="flex flex-col gap-4">
            <p className="text-center text-gray-600">환영합니다, {auth.currentUser?.displayName}!</p>
            <Button variant="outline" onClick={logOut}>로그아웃</Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
