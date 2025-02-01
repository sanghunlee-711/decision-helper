import { QueryClient } from "@/components/QueryClient";
import { adminDb } from "@/lib/firebaseAdmin";
import { MenuData } from "@/types/menu";
import { notFound } from "next/navigation";
import { use } from "react"; // ✅ Next.js의 서버에서 `use` 임포트

interface QuestionsPageProps {
  params: {
    id: string;
    categoryId: string;
  };
}

async function fetchQueryData(id: string) {
  console.log({ id });
  const docRef = adminDb.collection("menus").doc(id);
  const snapshot = await docRef.get();

  return snapshot.exists ? (snapshot.data() as MenuData) : { categories: [] };
}

export default function QuestionsPage({ params }: QuestionsPageProps) {
  const { id, categoryId } = params;

  // ✅ Next.js 15에서 서버 컴포넌트의 use() 활용
  const queryData = use(fetchQueryData(id)); 
  const questions = queryData?.categories.find((category) => category.id === categoryId)?.questions;

  if (!queryData || queryData.categories.length === 0) {
    notFound();
  }

  return <QueryClient questions={questions || []} />;
}
