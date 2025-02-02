import { QueryClient } from "@/components/QueryClient";
import { adminDb } from "@/lib/firebaseAdmin";
import { MenuData } from "@/types/menu";
import { notFound } from "next/navigation";


interface QuestionsPageProps {
  params: Promise<{ id: string; categoryId: string }>; 
}

async function fetchQueryData(id: string) {
  console.log({ id });
  const docRef = adminDb.collection("menus").doc(id);
  const snapshot = await docRef.get();

  return snapshot.exists ? (snapshot.data() as MenuData) : { categories: [] };
}

export default async function QuestionsPage({ params }: QuestionsPageProps) {
  // ✅ 여기서 params는 { id: string, categoryId: string } 타입
  const { id, categoryId } = await params;

  if (!id || !categoryId) {
    notFound();
  }

  // ✅ 데이터를 가져올 때 await 사용
  const queryData = await fetchQueryData(id);
  const questions = queryData?.categories.find((category) => category.id === categoryId)?.questions;

  if (!queryData || queryData.categories.length === 0) {
    notFound();
  }

  return <QueryClient questions={questions || []} />;
}
