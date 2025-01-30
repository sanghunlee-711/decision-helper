
// Interfaces for JSON Structure
export interface Question {
    id: string;
    text: string;
    weight: number;
    answers: Answer[];
  }
  
  export interface Answer {
    id: string;
    text: string;
    weight: number;
  }
  
  export interface Category {
    id: string;
    name: string;
    subcategories: Category[];
    questions: Question[];
  }
  
  export interface MenuStructure {
    categories: Category[];
  }