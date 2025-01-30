import { Button } from "@/components/ui/button"
import  Link  from "next/link";



export default function Home() {

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">오하이오</h1>
      <Button>
        <Link href ="/menu">메뉴등록 페이지 가기</Link>
      </Button>
      <Button>
        <Link href ="/questions">질문등록 페이지 가기</Link>  
      </Button>
      
    </div>
  );
}


