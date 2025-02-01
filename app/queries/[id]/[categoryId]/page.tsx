import { QueryClinet } from "@/components/QueryClient";
import { adminDb } from "@/lib/firebaseAdmin";
import { MenuData } from "@/types/menu";
import { notFound } from "next/navigation";

interface QuestionsPageProps {
  params: {
    id: string;
    categoryId: string;
  };
}

async function fetchQueryData(id: string): Promise<MenuData | null> {
  console.log({ id });
  const docRef = adminDb.collection("menus").doc(id)
  const snapshot = await docRef.get();

  return snapshot.exists ? (snapshot.data() as MenuData) : { categories: [] };
}


export default async function QuestionsPage({ params }: QuestionsPageProps) {
  const { id ,categoryId} = params;
  const queryData = await fetchQueryData(id);
  const questions = queryData?.categories.find((category)=> category.id === categoryId)?.questions
  if (!queryData) {
    notFound();
  }

  return (
    <QueryClinet params={params} questions={questions || []}/>
  );
}
