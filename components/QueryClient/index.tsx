'use client'

import { Answer, Question, Weight } from "@/types/menu"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface QuestionsPageProps {
  questions: Question[];
}

export function QueryClient({ questions }: QuestionsPageProps) {
  const [answers, setAnswers] = useState<{ [questionId: string]: Answer | null }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [topCategory, setTopCategory] = useState<{ id: string; name: string } | null>(null);

  // 이전 질문으로 돌아가기
  const goBack = () => {
    if (currentIndex > 0) {
      if(showResult) {
        setShowResult(false)
        setCurrentIndex(questions.length - 1);
        return;
      }
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 현재 질문의 답변을 선택
  const handleAnswer = (questionId: string, answer: Answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // ✅ "다음" 버튼 클릭 시 다음 질문으로 이동
  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  // ✅ 가중치 기반 결과 분석
  const calculateResult = () => {
    
    const categoryScores: Record<string, { id: string; name: string; score: number }> = {};
    setCurrentIndex(0)
    // ✅ 1. 선택된 모든 답변의 `weights`를 합산
    Object.values(answers).forEach((answer) => {
      if (answer) {
        answer.weights.forEach((weight: Weight) => {
          if (categoryScores[weight.id]) {
            categoryScores[weight.id].score += weight.weight;
          } else {
            categoryScores[weight.id] = { id: weight.id, name: weight.name, score: weight.weight };
          }
        });
      }
    });

    // ✅ 2. 가장 높은 가중치를 가진 서브 카테고리 찾기
    const topCategoryEntry = Object.values(categoryScores).reduce(
      (acc, category) => (category.score > acc.score ? category : acc),
      { id: "", name: "알 수 없음", score: 0 }
    );
    
    console.log(topCategoryEntry, answers);

    if (topCategoryEntry.id) {
      setTopCategory({ id: topCategoryEntry.id, name: topCategoryEntry.name });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-md relative overflow-hidden">
        {/* ✅ 카드 좌측 상단 - 이전 질문 버튼 */}
        {currentIndex > 0 && (
          <button
            onClick={goBack}
            className="absolute left-4 top-4 text-gray-500 hover:text-gray-800 transition-all"
          >
            ← 이전
          </button>
        )}

        {/* ✅ 카드 우측 상단 - 진행 상태 (1/5) */}
        {!showResult && (
          <div className="absolute right-4 top-4 text-gray-600">
            {currentIndex + 1} / {questions.length}
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            {showResult ? "결과 보기" : "질문 목록"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {!showResult ? (
              questions.slice(currentIndex, currentIndex + 1).map((q) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-semibold">{q.question}</h2>

                  <RadioGroup
                    className="mt-4 space-y-2"
                    value={answers[q.id]?.id || ""}
                    onValueChange={(selectedId) => {
                      const selectedAnswer = q.answers.find((a) => a.id === selectedId);
                      if (selectedAnswer) handleAnswer(q.id, selectedAnswer);
                    }}
                  >
                    {q.answers.map((a: Answer) => (
                      <div key={a.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={a.id} id={`answer-${a.id}`} />
                        <Label htmlFor={`answer-${a.id}`} className="cursor-pointer">
                          {a.option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg font-semibold text-center mb-4">
                  🎉 당신에게 가장 적합한 서브 카테고리는?
                </h2>
                <div className="text-center text-2xl font-bold text-blue-600">
                  {topCategory ? `📌 ${topCategory.name}` : "두구두구두구"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* ✅ "다음" 버튼 또는 "결과 확인" 버튼 */}
          {!showResult && (
            <Button 
              onClick={goNext} 
              className="w-full mt-6" 
              disabled={!answers[questions[currentIndex]?.id]} // 선택되지 않으면 비활성화
            >
              {"다음"}
            </Button>
          )}

          {/* ✅ "결과 보기" 버튼 클릭 시 결과 분석 실행 */}
          {showResult && (
            <Button onClick={calculateResult} className="w-full mt-6">
              결과 확인
            </Button>
          )}

          {/* ✅ "다시 테스트하기" 버튼 */}
          {showResult && (
            <Button onClick={() => {
              setAnswers({});
              setShowResult(false);
              setCurrentIndex(0);
              setTopCategory(null)
            }} className="w-full mt-6">
              다시 테스트하기
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
