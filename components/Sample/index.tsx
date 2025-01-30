/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

type Option = {
  id: string;
  text: string;
  weight: number;
};

type Question = {
  id: string;
  text: string;
  options: Option[];
};

type Subcategory = {
  id: string;
  name: string;
  weight: number;
  questions: Question[];
};

type Category = {
  id: string;
  name: string;
  subcategories: Subcategory[];
};

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "주류",
      subcategories: [
        {
          id: "1-1",
          name: "위스키",
          weight: 5,
          questions: [
            {
              id: "q1",
              text: "어떤 향을 선호하시나요?",
              options: [
                { id: "o1", text: "스모키", weight: 2 },
                { id: "o2", text: "달콤한", weight: 3 },
              ],
            },
          ],
        },
      ],
    },
  ]);

  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCategories((prevCategories) => {
        const activeIndex = prevCategories.findIndex(
          (category) => category.id === active.id
        );
        const overIndex = prevCategories.findIndex(
          (category) => category.id === over.id
        );

        return arrayMove(prevCategories, activeIndex, overIndex);
      });
    }
  };

  const updateSubcategoryWeight = (subcategoryId: string, weight: number) => {
    setCategories((prev) =>
      prev.map((category) => {
        return {
          ...category,
          subcategories: category.subcategories.map((subcategory) =>
            subcategory.id === subcategoryId
              ? { ...subcategory, weight }
              : subcategory
          ),
        };
      })
    );
  };

  const handleQuestionsUpdate = (
    subcategoryId: string,
    questionId: string,
    optionId: string,
    newWeight: number
  ) => {
    setCategories((prev) =>
      prev.map((category) => {
        return {
          ...category,
          subcategories: category.subcategories.map((subcategory) => {
            if (subcategory.id === subcategoryId) {
              return {
                ...subcategory,
                questions: subcategory.questions.map((question) => {
                  if (question.id === questionId) {
                    return {
                      ...question,
                      options: question.options.map((option) =>
                        option.id === optionId
                          ? { ...option, weight: newWeight }
                          : option
                      ),
                    };
                  }
                  return question;
                }),
              };
            }
            return subcategory;
          }),
        };
      })
    );
  };

  return (
    <div className="space-y-4">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={categories.map((category) => category.id)}
          strategy={verticalListSortingStrategy}
        >
          {categories.map((category) => (
            <SortableItem key={category.id} id={category.id}>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h3>{category.name}</h3>
                    <Button variant="ghost" size="sm">+ 세부 카테고리 추가</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {category.subcategories.map((subcategory) => (
                    <Accordion key={subcategory.id}>
                      <AccordionItem value={subcategory.id}>
                        <AccordionTrigger>{subcategory.name}</AccordionTrigger>
                        <AccordionContent>
                          <Slider
                            value={[subcategory.weight]}
                            onValueChange={(val) =>
                              updateSubcategoryWeight(subcategory.id, val[0])
                            }
                          />
                          {subcategory.questions.map((question) => (
                            <div key={question.id} className="mt-4">
                              <h4>{question.text}</h4>
                              <ul>
                                {question.options.map((option) => (
                                  <li key={option.id} className="flex items-center justify-between">
                                    <span>{option.text}</span>
                                    <Slider
                                      value={[option.weight]}
                                      onValueChange={(val) =>
                                        handleQuestionsUpdate(
                                          subcategory.id,
                                          question.id,
                                          option.id,
                                          val[0]
                                        )
                                      }
                                    />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </CardContent>
              </Card>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
