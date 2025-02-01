'use client'

import { logOut } from "@/lib/firebase"
import { Button } from "@/components/ui/button";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { useRouter } from "next/navigation";
import { LinkButton } from "../ui/LinkButton";

interface HomeClientProps {
    authToken: RequestCookie | undefined
}

export function HomeClient({authToken}: HomeClientProps) {
    const router = useRouter();

    const onClickLogout = () => {
        logOut()
        router.push("/login")
    }
    return (
        <div className="p-4">
        <h1 className="text-2xl font-bold">매출 유도 도우미</h1>
        
        {authToken ? (

        <Button variant="outline" onClick={onClickLogout}>로그아웃</Button>
          
        ) : (
          <LinkButton path="/login">
            로그인하러 가기
          </LinkButton>
        )}
          <LinkButton path="/about">
          사용법 알아보기
          </LinkButton>
          <LinkButton path="/dashboard">
          대쉬보드 가기
          </LinkButton>
        
      </div>
    )
}