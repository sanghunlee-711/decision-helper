'use client'

import { Answer, Question } from "@/types/menu"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { Label, SelectGroup } from "@radix-ui/react-select"
import { Button } from "../ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface QuestionsPageProps {
  params: {
    id: string;
    categoryId: string;
  };
  questions: Question[];
}

export function QueryClinet({params, questions}: QuestionsPageProps) {
const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
const router = useRouter();

  const handleAnswer = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    router.push(`/queries/${params.id}/${params.categoryId}/result?answers=${JSON.stringify(answers)}`);
  };

    return (
      <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">질문 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.map((q) => (
            <div key={q.id} className="mb-6">
              <h2 className="text-lg font-semibold">{q.question}</h2>
              <RadioGroup className="mt-2" 
                onValueChange={(val) => handleAnswer(q.id, val)}
              >
                <SelectGroup>
                {q.answers.map((a: Answer) => (
                  <Label
                    key={a.id}
                    className={`block cursor-pointer px-4 py-2 border rounded-md ${
                      answers[q.id] === a.option ? "bg-blue-100 border-blue-500" : "border-gray-300"
                    }`}
                  >
                    <RadioGroupItem
                      itemID={q.id}
                      value={a.option}
                      checked={answers[q.id] === a.option}
                      onClick={()=> handleAnswer(q.id, a.option)}
                    />
                    {a.option}
                  </Label>
                  
                ))}
                </SelectGroup>
              </RadioGroup>
            </div>
          ))}
          <Button onClick={handleSubmit} className="w-full mt-4">
            결과 확인
          </Button>
        </CardContent>
      </Card>
    </div>
    )
}

