"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { auth, logOut } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-6 shadow-lg w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">대시보드</CardTitle>
          </CardHeader>
          <div className="flex flex-col gap-[12px] mb-[12px]">
          <Button>
            <Link href ="/menu">메뉴등록 페이지 가기</Link>
        </Button>
        <Button>
            <Link href ="/questions">질문등록 페이지 가기</Link>  
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
