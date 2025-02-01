"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, MenuData } from "@/types/menu";
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getEmailUsername } from "@/utils/email";


export default function MenuClient({ initialMenus, email }: { initialMenus: MenuData; email: string }) {
  const [menus, setMenus] = useState<MenuData>(initialMenus || { categories: [] });
  const [categoryText, setCategoryText] = useState("");
  const [subcategoryText, setSubcategoryText] = useState<{ [key: string]: string }>({});
  
  const generateId = () => crypto.randomUUID(); // ✅ UUID 생성

  /** ✅ 새로운 카테고리 추가 */
  const addCategory = () => {
    if (!categoryText.trim()) return alert("카테고리 이름을 입력하세요.");
    const newCategory: Category = {
      id: generateId(),
      name: categoryText,
      subcategories: [],
      questions: [],
    };
    setMenus((prev) => ({ categories: [...prev.categories, newCategory] }));
    setCategoryText("");
  };

  /** ✅ 카테고리에 서브카테고리 추가 */
  const addSubcategory = (categoryId: string) => {
    if (!subcategoryText[categoryId]?.trim()) return alert("서브카테고리 이름을 입력하세요.");
    setMenus((prev) => ({
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: [...(cat.subcategories || []), { id: generateId(), name: subcategoryText[categoryId] }],
            }
          : cat
      ),
    }));
    setSubcategoryText((prev) => ({ ...prev, [categoryId]: "" }));
  };

  /** ✅ Firebase에 유저별 데이터 저장 */
  const saveToFirebase = async () => {
    if (!email) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      await setDoc(doc(collection(db, "menus"), getEmailUsername(email)), menus);
      alert("메뉴가 저장되었습니다!");
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">메뉴 관리</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ✅ 카테고리 추가 */}
          <div className="flex gap-3 mb-6">
            <Input
              value={categoryText}
              onChange={(e) => setCategoryText(e.target.value)}
              placeholder="새 카테고리 입력"
            />
            <Button onClick={addCategory}>카테고리 추가</Button>
          </div>

          <Accordion type="single" collapsible>
            {menus.categories.map((category) => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="text-lg font-semibold">{category.name}</AccordionTrigger>
                <AccordionContent>
    {/* ✅ 서브카테고리 추가 */}
    <div className="flex gap-3 mt-4">
                    <Input
                      value={subcategoryText[category.id] || ""}
                      onChange={(e) => setSubcategoryText((prev) => ({ ...prev, [category.id]: e.target.value }))}
                      placeholder="새 서브카테고리 입력"
                    />
                    <Button onClick={() => addSubcategory(category.id)} variant="outline">
                      서브카테고리 추가
                    </Button>
                  </div>

                  {/* ✅ 서브카테고리 리스트 */}
                  <ul className="ml-4 mt-4 space-y-2">
                    {(category.subcategories || []).map((sub) => (
                      <li key={sub.id} className="text-gray-700 text-sm px-2 py-1 rounded bg-gray-100 inline-block">
                        {sub.name}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* ✅ 저장 버튼 */}
          <Button onClick={saveToFirebase} className="w-full mt-6">
            저장하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
