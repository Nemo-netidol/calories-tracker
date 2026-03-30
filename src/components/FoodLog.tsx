import React from "react";
import type { FoodItem } from "../types";

interface FoodLogProps {
  foodLog: FoodItem[];
}

export function FoodLog({ foodLog }: FoodLogProps) {
  const categories: ("Breakfast" | "Lunch" | "Dinner" | "Snack")[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

  return (
    <div className="space-y-10 py-4 duration-500">
      {categories.map((cat) => {
        const items = foodLog.filter((i) => i.category === cat);
        if (items.length === 0) return null;

        const catCalories = items.reduce((sum, i) => sum + i.calories, 0);

        return (
          <section key={cat} className="space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
              <h2 className="font-headline text-xl font-extrabold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {cat === "Breakfast" ? "wb_twilight" : cat === "Lunch" ? "wb_sunny" : cat === "Dinner" ? "dark_mode" : "cookie"}
                </span>
                {cat}
              </h2>
              <span className="text-sm font-label text-on-surface-variant">{catCalories} kcal</span>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container rounded-2xl p-4 flex items-center justify-between hover:bg-surface-bright transition-colors group"
                >
                  <div className="flex flex-col">
                    <h3 className="font-body font-semibold text-on-surface">{item.name}</h3>
                    <p className="text-xs text-on-surface-variant font-medium">{item.time} • {item.date}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-headline font-bold text-on-surface">{item.calories} kcal</span>
                    <div className="flex gap-2">
                      <span className="bg-primary-container/20 text-primary-fixed-dim text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                        {item.protein}g Protein
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
