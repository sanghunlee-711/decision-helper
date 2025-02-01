"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Question, Weight } from "@/types/menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ResultPageProps {
  params: {
    id: string;
    categoryId: string;
  };
  questions: Question[];
}

export default function ResultPage({ questions }: ResultPageProps) {
  const searchParams = useSearchParams();
  const selectedAnswers = JSON.parse(searchParams.get("answers") || "{}");

  const [recommended, setRecommended] = useState<{ id: string; name: string; weight: number } | null>(null);

  useEffect(() => {
    const subcategoryWeights: { [subcategoryId: string]: number } = {};

    // ✅ 선택한 답변들의 가중치 합산
    questions.forEach((q) => {
      const selectedOption = q.answers.find((a) => a.option === selectedAnswers[q.id]);
      if (selectedOption) {
        selectedOption.weights.forEach((w: Weight) => {
          subcategoryWeights[w.id] = (subcategoryWeights[w.id] || 0) + w.weight;
        });
      }
    });

    // ✅ 가장 높은 가중치의 subcategory 추천
    const sorted = Object.entries(subcategoryWeights).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      setRecommended({ id: sorted[0][0], name: sorted[0][0], weight: sorted[0][1] });
    }
  }, [selectedAnswers, questions]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">추천 결과</CardTitle>
        </CardHeader>
        <CardContent>
          {recommended ? (
            <div className="flex flex-col items-center space-y-4">
              <Badge className="text-lg bg-green-500 text-white px-4 py-2 rounded-lg">
                추천 메뉴: {recommended.name}
              </Badge>

              <div className="w-full">
                <p className="text-center text-gray-600">가중치: {recommended.weight}</p>
                <Progress value={(recommended.weight / 5) * 100} className="mt-2 w-full" />
              </div>

              <Button className="w-full mt-4" onClick={() => window.history.back()}>
                다시 선택하기
              </Button>
            </div>
          ) : (
            <p className="text-lg mt-4 text-center">추천 결과가 없습니다.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
