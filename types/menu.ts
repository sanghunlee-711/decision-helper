// types/menu.ts
export interface Subcategory {
  id: string;
  name: string;
}

export interface Weight {
  id: string; // subcategory ID
  name: string; // subcategory Name
  weight: number; // 1~5 가중치
}

export interface Answer {
  id: string;
  option: string;
  weights: Weight[];
}

export interface Question {
  id: string;
  question: string;
  answers: Answer[];
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
  questions: Question[];
}

export interface MenuData {
  categories: Category[];
}
