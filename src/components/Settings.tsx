import React, { useState } from "react";
import type { FoodItem } from "../types";

interface SettingsProps {
  calorieGoal: number;
  proteinGoal: number;
  onUpdateGoals: (calories: number, protein: number) => void;
}

export function Settings({ calorieGoal, proteinGoal, onUpdateGoals }: SettingsProps) {
  const [tempCalories, setTempCalories] = useState(calorieGoal.toString());
  const [tempProtein, setTempProtein] = useState(proteinGoal.toString());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoals(parseInt(tempCalories) || 0, parseInt(tempProtein) || 0);
  };

  return (
    <div className="py-4 space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="font-headline font-extrabold text-2xl text-on-surface">Settings</h2>
        <p className="text-sm text-on-surface-variant">Manage your nutrition targets</p>
      </div>

      <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/10 shadow-xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
              Daily Calorie Goal (kcal)
            </label>
            <div className="obsidian-inset rounded-2xl p-1 focus-within:ring-1 focus-within:ring-primary transition-all">
              <input
                type="number"
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface px-4 py-3 font-body text-lg"
                value={tempCalories}
                onChange={(e) => setTempCalories(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
              Daily Protein Goal (g)
            </label>
            <div className="obsidian-inset rounded-2xl p-1 focus-within:ring-1 focus-within:ring-primary transition-all">
              <input
                type="number"
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface px-4 py-3 font-body text-lg"
                value={tempProtein}
                onChange={(e) => setTempProtein(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">save</span>
              Update Goals
            </button>
          </div>
        </form>
      </div>

      <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5">
        <div className="flex items-center gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined">info</span>
          <p className="text-xs leading-relaxed">
            Changing your goals will immediately update your daily progress tracking on the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
