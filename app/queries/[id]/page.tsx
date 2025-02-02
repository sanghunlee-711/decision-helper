import { adminDb } from "@/lib/firebaseAdmin";
import { MenuData } from "@/types/menu";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QueryPageProps {
  params: Promise<{ id: string }>
}

async function fetchQueryData(id: string): Promise<MenuData | null> {
  const docRef = adminDb.collection("menus").doc(id);
  const snapshot = await docRef.get();

  return snapshot.exists ? (snapshot.data() as MenuData) : { categories: [] };
}

export default async function QueryPage({ params }: QueryPageProps ) {
  const { id } = await params;
  const queryData = await fetchQueryData(id);

  if (!queryData) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">카테고리 선택</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {queryData?.categories?.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-all">
            <CardHeader className="text-center text-lg font-semibold">
              {category.name}
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link href={`/queries/${id}/${category.id}`} passHref>
                <Button className="w-full" variant="outline">
                  선택하기
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
