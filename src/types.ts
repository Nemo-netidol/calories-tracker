export type View = "dashboard" | "diary" | "add" | "coach" | "settings";

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  time: string;
  date: string; // ISO format (YYYY-MM-DD)
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  carbs?: number | null;
  fat?: number | null;
}

export interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
}

export interface User {
  id: number;
  username: string;
  weight: number;
  target_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fat: number;
  tdee: number;
  bmr: number;
}
