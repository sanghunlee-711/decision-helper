// types/questions.ts
export interface SubCategory {
  id: string;
  name: string;
}

export interface Weight {
  id: string; // subCategory ID
  name: string; // subCategory Name
  weight: number; // 1~5 가중치
}

export interface Answer {
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
  subcategories: SubCategory[];
  questions: Question[];
}

export interface MenuData {
  categories: Category[];
}
