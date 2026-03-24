import React, { useState } from "react";
import "./index.css";
import type { View, FoodItem, Message } from "./types";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { Dashboard } from "./components/Dashboard";
import { FoodLog } from "./components/FoodLog";
import { AddFood } from "./components/AddFood";
import { Coach } from "./components/Coach";
import { Settings } from "./components/Settings";
import { GoogleGenAI } from '@google/genai';
import { useEffect } from "react";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

async function getAIResponse(prompt: string) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      return response.text;
    }

const getTodayISO = () => new Date().toISOString().split("T")[0];
const getPastDateISO = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

const INITIAL_FOOD_LOG: FoodItem[] = [
  {
    id: "1",
    name: "Oats with Almond Milk",
    amount: "1 bowl (350g)",
    calories: 310,
    protein: 12,
    time: "8:45 AM",
    date: getTodayISO(),
    category: "Breakfast",
  },
  {
    id: "2",
    name: "Black Coffee",
    amount: "Large (400ml)",
    calories: 5,
    protein: 0,
    time: "9:00 AM",
    date: getTodayISO(),
    category: "Breakfast",
  },
  {
    id: "3",
    name: "Grilled Chicken Salad",
    amount: "Standard portion",
    calories: 450,
    protein: 45,
    time: "1:30 PM",
    date: getTodayISO(),
    category: "Lunch",
  },
  {
    id: "4",
    name: "Protein Shake",
    amount: "1 scoop whey",
    calories: 140,
    protein: 24,
    time: "4:00 PM",
    date: getTodayISO(),
    category: "Snack",
  },
  // Past data for graph
  {
    id: "p1",
    name: "Dinner",
    amount: "Portion",
    calories: 1800,
    protein: 80,
    time: "7:00 PM",
    date: getPastDateISO(1),
    category: "Dinner",
  },
  {
    id: "p2",
    name: "Meals",
    amount: "Full Day",
    calories: 2200,
    protein: 140,
    time: "8:00 PM",
    date: getPastDateISO(2),
    category: "Dinner",
  },
  {
    id: "p3",
    name: "Meals",
    amount: "Full Day",
    calories: 1500,
    protein: 100,
    time: "8:00 PM",
    date: getPastDateISO(3),
    category: "Dinner",
  },
  {
    id: "p4",
    name: "Meals",
    amount: "Full Day",
    calories: 2600,
    protein: 160,
    time: "8:00 PM",
    date: getPastDateISO(4),
    category: "Dinner",
  },
  {
    id: "p5",
    name: "Meals",
    amount: "Full Day",
    calories: 2100,
    protein: 130,
    time: "8:00 PM",
    date: getPastDateISO(5),
    category: "Dinner",
  },
  {
    id: "p6",
    name: "Meals",
    amount: "Full Day",
    calories: 1900,
    protein: 120,
    time: "8:00 PM",
    date: getPastDateISO(6),
    category: "Dinner",
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "bot",
    text: "Hello! I'm your Nutrition Assistant. How can I help you today?",
    time: "10:00 AM",
  },
];

import { getTodayLog } from "./services/foodService";

export function App() {
  const [view, setView] = useState<View>("dashboard");
  const [foodLog, setFoodLog] = useState<FoodItem[]>([]);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [calorieGoal, setCalorieGoal] = useState(2400);
  const [proteinGoal, setProteinGoal] = useState(150);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await getTodayLog();
        setFoodLog(data || []);
        console.log(data)
      } catch (err) {
        console.error("Failed to fetch food log:", err);
      }
    };
    fetchFoods();
  }, []);

  const todayISO = getTodayISO();
  const todayItems = foodLog.filter((item) => item.date === todayISO);
  const totalCalories = todayItems.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = todayItems.reduce((sum, item) => sum + item.protein, 0);

  const calculateWeeklyData = () => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      const dayItems = foodLog.filter((item) => item.date === iso);
      const dayCalories = dayItems.reduce((sum, item) => sum + item.calories, 0);
      const dayProtein = dayItems.reduce((sum, item) => sum + item.protein, 0);
      
      result.push({
        day: days[d.getDay()],
        calories: dayCalories,
        protein: dayProtein,
      });
    }
    return result;
  };

  const handleAddFood = (newItem: Omit<FoodItem, "id" | "time" | "date">) => {
    const item: FoodItem = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: getTodayISO(),
    };
    setFoodLog([item, ...foodLog]);
    setView("log");
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // AI response
      const responseText = await getAIResponse(userMsg.text);
      const AIMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: responseText || "I'm not exactly sure how to help with that.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, AIMsg]);
    } catch (error) {
      console.error("AI Error:", error);
    }
  };

  const handleUpdateGoals = (calories: number, protein: number) => {
    setCalorieGoal(calories);
    setProteinGoal(protein);
    setView("dashboard");
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body pb-32">
      <Header />

      <main className="px-6 pt-20 max-w-2xl mx-auto">
        {view === "dashboard" && (
          <Dashboard
            totalCalories={totalCalories}
            calorieGoal={calorieGoal}
            totalProtein={totalProtein}
            proteinGoal={proteinGoal}
            recentMeals={todayItems.slice(0, 3)}
            weeklyData={calculateWeeklyData()}
          />
        )}
        {view === "log" && <FoodLog foodLog={foodLog} />}
        {view === "add" && <AddFood onSave={handleAddFood} onCancel={() => setView("dashboard")} />}
        {view === "coach" && <Coach messages={messages} onSend={handleSendMessage} />}
        {view === "settings" && (
          <Settings
            calorieGoal={calorieGoal}
            proteinGoal={proteinGoal}
            onUpdateGoals={handleUpdateGoals}
          />
        )}
      </main>

      <BottomNav activeView={view} setView={setView} />
    </div>
  );
}

export default App;
