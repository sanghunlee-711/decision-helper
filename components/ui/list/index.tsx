"use client"

import { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "@/components/SortableItem";
import { Category } from "@/types/menu";

export const List = () => {
    const [categories, setCategories] = useState<Category[]>([
        { id: "1", name: "주류", subcategories: [], questions: [] },
        { id: "2", name: "안주", subcategories: [], questions: [] },
      ]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
    
        if (active.id !== over?.id) {
          setCategories((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over?.id || 0);
            return arrayMove(items, oldIndex, newIndex);
          });
        }
      };


    return(
        <>
        
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={categories.map((cat) => cat.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul>
              {categories.map((category) => (
                <SortableItem key={category.id} id={category.id}>
                  <div className="p-4 border rounded mb-2">{category.name}</div>
                </SortableItem>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
        </>
    )
}