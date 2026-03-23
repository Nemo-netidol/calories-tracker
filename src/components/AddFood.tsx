import React, { useState } from "react";
import type { FoodItem } from "../types";
import { logMeal } from "../services/foodService";

interface AddFoodProps {
  onSave: (item: Omit<FoodItem, "id" | "time" | "date">) => void;
  onCancel: () => void;
}

export function AddFood({ onSave, onCancel }: AddFoodProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [category, setCategory] = useState<FoodItem["category"]>("Lunch");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
    const mealData = {
      name,
      amount: parseInt(amount) || 0,
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      category,
      time: currentTime,
    };

    // Update local state for immediate UI feedback
    onSave({
      name: mealData.name,
      amount: mealData.amount,
      calories: mealData.calories,
      protein: mealData.protein,
      category: mealData.category,
    });

    // Persist to TiDB database
    logMeal(mealData);
  };

  return (
    <div className="py-8 duration-300">
      <div className="w-full bg-surface-container-low rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container to-secondary-container opacity-50"></div>
        <div className="mb-8">
          <h2 className="font-headline font-extrabold text-3xl text-on-surface mb-1">Add Food</h2>
          <p className="font-label text-on-surface-variant text-sm tracking-wide">Enter nutrition details for your meal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
              Food Name
            </label>
            <div className="obsidian-inset rounded-xl p-1 focus-within:ring-1 focus-within:ring-primary transition-all">
              <input
                required
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-stone-600 px-4 py-3 font-body"
                placeholder="e.g. Avocado Toast"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
              Amount (grams)
            </label>
            <div className="obsidian-inset rounded-xl p-1 focus-within:ring-1 focus-within:ring-primary transition-all">
              <input
                required
                type="number"
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-stone-600 px-4 py-3 font-body"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                Calories (kcal)
              </label>
              <div className="obsidian-inset rounded-xl p-1 focus-within:ring-1 focus-within:ring-primary transition-all">
                <input
                  required
                  type="number"
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-stone-600 px-4 py-3 font-body"
                  placeholder="0"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                Protein (g)
              </label>
              <div className="obsidian-inset rounded-xl p-1 focus-within:ring-1 focus-within:ring-primary transition-all">
                <input
                  required
                  type="number"
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-stone-600 px-4 py-3 font-body"
                  placeholder="0"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
              Category
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["Breakfast", "Lunch", "Dinner", "Snack"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    category === cat
                      ? "bg-primary-container text-on-primary-container"
                      : "bg-surface-container-highest text-on-surface-variant"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">save</span>
              Save Food
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full mt-4 text-on-surface-variant font-label text-sm font-semibold uppercase tracking-widest hover:text-on-surface transition-colors py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
