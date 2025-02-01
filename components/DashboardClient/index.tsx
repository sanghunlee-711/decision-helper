"use client"

import { logOut } from "@/lib/firebase"
import { getEmailUsername } from "@/utils/email"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { LinkButton } from "../ui/LinkButton"
import { useUser } from "@/context/UserContext"


export const DashBoardClient = () => {
    const currentUser = useUser();


    return (
        <div className="flex justify-center items-center min-h-screen">
        <Card className="p-6 shadow-lg w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">대시보드</CardTitle>
          </CardHeader>
          <div className="flex flex-col gap-[12px] mb-[12px]">
        <LinkButton path="/menu">
          메뉴등록 페이지 가기
        </LinkButton>
        <LinkButton path="/questions">
          질문등록 페이지 가기
        </LinkButton>
        <LinkButton path={`/queries/${getEmailUsername(currentUser?.email || '')}`}>
          질문 미리 테스트해보기
        </LinkButton>
        </div>
          <CardContent className="flex flex-col gap-4">
            <p className="text-center text-gray-600">환영합니다, {currentUser?.displayName}!</p>
            <Button variant="outline" onClick={logOut}>로그아웃</Button>
          </CardContent>
        </Card>
      </div>
    )
}