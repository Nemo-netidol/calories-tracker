import React, { useState } from "react";
import type { FoodItem } from "../types";
import { formatAMPM } from "../utils/time";

interface AddFoodProps {
  onSave: (item: Omit<FoodItem, "id">) => Promise<void>;
  onCancel: () => void;
  initialCategory?: FoodItem["category"];
  initialDate?: string;
}

export function AddFood({ onSave, onCancel, initialCategory, initialDate }: AddFoodProps) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [category, setCategory] = useState<FoodItem["category"]>(initialCategory || "Lunch");

  // New States for Custom Date and Time
  const [customDate, setCustomDate] = useState(initialDate || new Date().toISOString().slice(0, 10));
  const [customTime, setCustomTime] = useState(new Date().toTimeString().slice(0, 5));
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSave({
        name,
        calories: parseInt(calories) || 0,
        protein: parseInt(protein) || 0,
        carbs: carbs === "" ? null : parseInt(carbs) || 0,
        fat: fat === "" ? null : parseInt(fat) || 0,
        category,
        time: formatAMPM(customTime),
        date: customDate,
      });
    } catch (err) {
      console.error("Failed to save food:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-4 sm:py-8 duration-300">
      <div className="w-full bg-surface-container-low rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="mb-8">
          <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-on-surface mb-1">Add Food</h2>
          <p className="font-label text-on-surface-variant text-xs sm:text-sm tracking-wide">Enter nutrition details for your meal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-label text-label font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
              Food Name
            </label>
            <div className="obsidian-inset rounded-xl p-1 focus-within:ring-1 focus-within:ring-primary transition-all">
              <input
                required
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant px-4 py-3 font-body text-body-sm sm:text-body"
                placeholder="e.g. Avocado Toast"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label text-label font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                Category
              </label>
              <div className="obsidian-inset rounded-xl p-1 focus-within:ring-1 focus-within:ring-primary transition-all">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface px-4 py-3 font-body text-body-sm sm:text-body appearance-none cursor-pointer"
                >
                  {["Breakfast", "Lunch", "Dinner", "Snack"].map((cat) => (
                    <option key={cat} value={cat} className="bg-surface-container-highest">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block font-label text-label font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                Log Date
              </label>
              <div
                className="obsidian-inset rounded-xl p-1 focus-within:ring-1 focus-within:ring-primary transition-all cursor-pointer"
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input) (input as any).showPicker?.();
                }}
              >
                <input
                  required
                  type="date"
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface px-4 py-3 font-body text-body-sm sm:text-body cursor-pointer"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label text-label font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                Calories
              </label>
              <div className="obsidian-inset rounded-xl p-1 focus-within:ring-1 focus-within:ring-primary transition-all">
                <input
                  required
                  type="number"
                  className="w-full bg-transparent border-none focus:ring-0 text-primary placeholder:text-on-surface-variant px-4 py-3 font-body font-bold text-body-sm sm:text-body"
                  placeholder="0"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block font-label text-label font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                Protein (g)
              </label>
              <div className="obsidian-inset rounded-xl p-1 focus-within:ring-1 focus-within:ring-secondary transition-all">
                <input
                  required
                  type="number"
                  className="w-full bg-transparent border-none focus:ring-0 text-secondary placeholder:text-on-surface-variant px-4 py-3 font-body font-bold text-body-sm sm:text-body"
                  placeholder="0"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block font-label text-label font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                Carbs (g)
              </label>
              <div className="obsidian-inset rounded-xl p-1 focus-within:ring-1 focus-within:ring-success transition-all">
                <input
                  type="number"
                  className="w-full bg-transparent border-none focus:ring-0 text-success placeholder:text-on-surface-variant px-4 py-3 font-body font-bold text-body-sm sm:text-body"
                  placeholder="0"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block font-label text-label font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                Fat (g)
              </label>
              <div className="obsidian-inset rounded-xl p-1 focus-within:ring-1 focus-within:ring-warning transition-all">
                <input
                  type="number"
                  className="w-full bg-transparent border-none focus:ring-0 text-warning placeholder:text-on-surface-variant px-4 py-3 font-body font-bold text-body-sm sm:text-body"
                  placeholder="0"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block font-label text-label font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                Time
              </label>
              <div
                className="obsidian-inset rounded-xl p-1 focus-within:ring-1 focus-within:ring-primary transition-all cursor-pointer"
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input) (input as any).showPicker?.();
                }}
              >
                <input
                  required
                  type="time"
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface px-4 py-3 font-body text-body-sm sm:text-body cursor-pointer"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className={`w-full ${isSaving ? 'bg-outline-variant/20 text-on-surface-variant' : 'bg-primary-container text-on-primary'} font-headline font-bold py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group`}
            >
              <span className={`material-symbols-outlined text-xl ${isSaving ? 'animate-spin' : 'group-hover:rotate-12'} transition-transform`}>
                {isSaving ? 'progress_activity' : 'save'}
              </span>
              {isSaving ? 'Saving...' : 'Save Food'}
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
