"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuData } from "@/types/menu";
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getEmailUsername } from "@/utils/email";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DialogHeader, DialogFooter } from "../ui/dialog";

export default function QuestionsClient({
  initialMenus,
  email,
}: {
  initialMenus: MenuData;
  email: string;
}) {
  const [menus, setMenus] = useState<MenuData>(
    initialMenus || { categories: [] }
  );
  const [questionText, setQuestionText] = useState<{ [key: string]: string }>(
    {}
  );
  const [answerText, setAnswerText] = useState<{ [key: string]: string }>({});
  const [selectedSubcategory, setSelectedSubcategory] = useState<{
    [key: string]: string;
  }>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  /** ✅ ShadCN UI Dialog로 알림 표시 */
  const showAlert = (message: string) => {
    setDialogMessage(message);
    setDialogOpen(true);
  };
  const generateId = () => crypto.randomUUID(); // ✅ UUID 생성

  /** ✅ 특정 카테고리에 질문 추가 */
  const addQuestion = (categoryId: string) => {
    if (!questionText[categoryId]?.trim())
      return showAlert("질문을 입력하세요.");

    const newQuestion = {
      id: generateId(),
      question: questionText[categoryId],
      answers: [],
    };

    setMenus((prev) => ({
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              questions: [...(cat.questions || []), newQuestion], // ✅ 기존 questions 유지 후 추가
            }
          : cat
      ),
    }));

    setQuestionText((prev) => ({ ...prev, [categoryId]: "" }));
  };

  /** ✅ 특정 질문에 답변 추가 */
  const addAnswer = (categoryId: string, questionId: string) => {
    if (!answerText[questionId]?.trim()) return showAlert("답변을 입력하세요.");

    const newAnswer = {
      id: generateId(),
      option: answerText[questionId],
      weights: [], // ✅ 초기 weights는 비어 있음 (추후 추가)
    };

    setMenus((prev) => ({
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              questions: cat.questions.map((q) =>
                q.id === questionId
                  ? { ...q, answers: [...q.answers, newAnswer] }
                  : q
              ),
            }
          : cat
      ),
    }));

    setAnswerText((prev) => ({ ...prev, [questionId]: "" }));
  };

  const removeAnswer = (
    categoryId: string,
    questionId: string,
    answerId: string
  ) => {
    // ans.weights.filter((w)=> w.id !== weightId),
    setMenus((prev) => ({
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              questions: cat.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      answers: q.answers.filter((a) => a.id !== answerId),
                    }
                  : q
              ),
            }
          : cat
      ),
    }));
  };

  /** ✅ Firestore에 메뉴 데이터 저장 */
  const saveToFirebase = async () => {
    if (!email) {
      showAlert("로그인이 필요합니다.");
      return;
    }
    try {
      await setDoc(
        doc(collection(db, "menus"), getEmailUsername(email)),
        menus
      );
      showAlert("질문이 Firestore에 저장되었습니다! ✅");
    } catch (error) {
      console.error("🔥 Firestore 저장 오류:", error);
      showAlert("질문 저장 중 오류가 발생했습니다.");
    }
  };

  /** ✅ 특정 답변의 weight 추가 (subcategory 선택 후 weight 입력) */
  const addWeight = (
    categoryId: string,
    questionId: string,
    answerId: string
  ) => {
    if (!selectedSubcategory[answerId])
      return showAlert("서브카테고리를 선택하세요.");

    setMenus((prev) => ({
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              questions: cat.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      answers: q.answers.map((ans) =>
                        ans.id === answerId
                          ? {
                              ...ans,
                              weights: [
                                ...ans.weights,
                                {
                                  id: selectedSubcategory[answerId],
                                  name:
                                    cat.subcategories.find(
                                      (sub) =>
                                        sub.id === selectedSubcategory[answerId]
                                    )?.name || "Unknown",
                                  weight: 1, // 기본 가중치 1
                                },
                              ],
                            }
                          : ans
                      ),
                    }
                  : q
              ),
            }
          : cat
      ),
    }));

    setSelectedSubcategory((prev) => ({ ...prev, [answerId]: "" }));
  };

  const removeWeight = (
    categoryId: string,
    questionId: string,
    answerId: string,
    weightId: string
  ) => {
    setMenus((prev) => ({
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              questions: cat.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      answers: q.answers.map((ans) =>
                        ans.id === answerId
                          ? {
                              ...ans,
                              weights: ans.weights.filter(
                                (w) => w.id !== weightId
                              ),
                            }
                          : ans
                      ),
                    }
                  : q
              ),
            }
          : cat
      ),
    }));
  };

  /** ✅ 특정 weight의 값 변경 */
  const updateWeight = (
    categoryId: string,
    questionId: string,
    answerId: string,
    subcategoryId: string,
    value: number
  ) => {
    setMenus((prev) => ({
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              questions: cat.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      answers: q.answers.map((ans) =>
                        ans.id === answerId
                          ? {
                              ...ans,
                              weights: ans.weights.map((w) =>
                                w.id === subcategoryId
                                  ? { ...w, weight: value }
                                  : w
                              ),
                            }
                          : ans
                      ),
                    }
                  : q
              ),
            }
          : cat
      ),
    }));
  };

  return (
    <div className="w-full p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">질문 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {menus.categories.map((category) => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger>{category.name}</AccordionTrigger>
                <AccordionContent>
                  {/* ✅ 질문 추가 UI */}
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={questionText[category.id] || ""}
                      onChange={(e) =>
                        setQuestionText((prev) => ({
                          ...prev,
                          [category.id]: e.target.value,
                        }))
                      }
                      placeholder="새 질문 입력"
                    />
                    <Button
                      onClick={() => addQuestion(category.id)}
                      variant="outline"
                    >
                      질문 추가
                    </Button>
                  </div>

                  {/* ✅ 기존 질문 & 답변 리스트 */}
                  {category.questions?.map((question) => (
                    <div key={question.id} className="ml-4 border-l pl-4 mt-4">
                      <strong className="block text-lg font-semibold">
                        {question.question}
                      </strong>

                      {/* ✅ 답변 추가 UI */}
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={answerText[question.id] || ""}
                          onChange={(e) =>
                            setAnswerText((prev) => ({
                              ...prev,
                              [question.id]: e.target.value,
                            }))
                          }
                          placeholder="새 답변 입력"
                        />
                        <Button
                          onClick={() => addAnswer(category.id, question.id)}
                        >
                          답변 추가
                        </Button>
                      </div>

                      {question.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className="ml-4 mt-4 border-l pl-4"
                        >
                          <div className="flex justify-between items-center">
                            <strong>답변: {answer.option}</strong>
                            <Button
                              onClick={() =>
                                removeAnswer(
                                  category.id,
                                  question.id,
                                  answer.id
                                )
                              }
                            >
                              답변 삭제
                            </Button>
                          </div>
                          {/* ✅ 가중치 추가 UI */}
                          <div className="flex gap-2 mt-2">
                            <Select
                              onValueChange={(value) =>
                                setSelectedSubcategory((prev) => ({
                                  ...prev,
                                  [answer.id]: value,
                                }))
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="서브카테고리 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                {category.subcategories.map((sub) => (
                                  <SelectItem key={sub.id} value={sub.id}>
                                    {sub.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={() =>
                                addWeight(category.id, question.id, answer.id)
                              }
                            >
                              가중치 추가
                            </Button>
                          </div>

                          {answer.weights.map((w) => (
                            <div
                              key={w.id}
                              className="flex items-center gap-2 mt-2"
                            >
                              <span>{w.name}</span>
                              <Slider
                                min={1}
                                max={5}
                                step={1}
                                value={[w.weight]}
                                onValueChange={(value) =>
                                  updateWeight(
                                    category.id,
                                    question.id,
                                    answer.id,
                                    w.id,
                                    value[0]
                                  )
                                }
                              />
                              <Button
                                onClick={() =>
                                  removeWeight(
                                    category.id,
                                    question.id,
                                    answer.id,
                                    w.id
                                  )
                                }
                              >
                                x
                              </Button>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      <Button onClick={saveToFirebase} className="text-white px-4 py-2 mt-4">
        저장하기
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>알림</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end">
            <Button onClick={() => setDialogOpen(false)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
