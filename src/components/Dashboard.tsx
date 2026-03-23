import React from "react";
import type { FoodItem } from "../types";

interface DashboardProps {
  totalCalories: number;
  calorieGoal: number;
  totalProtein: number;
  proteinGoal: number;
  recentMeals: FoodItem[];
  weeklyData: { day: string; calories: number; protein: number }[];
}

export function Dashboard({
  totalCalories,
  calorieGoal,
  totalProtein,
  proteinGoal,
  recentMeals,
  weeklyData,
}: DashboardProps) {
  const calorieProgress = (totalCalories / calorieGoal) * 100;
  const proteinProgress = (totalProtein / proteinGoal) * 100;

  return (
    <div className="space-y-8 duration-500">
      <section className="grid grid-cols-2 gap-4 mt-4">
        {/* Calories Card */}
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10">
          <p className="font-label text-on-surface-variant text-[10px] uppercase tracking-wider mb-1">Calories</p>
          <div className="flex items-baseline gap-1">
            <span className="font-headline text-2xl font-extrabold text-on-surface">
              {totalCalories.toLocaleString()}
            </span>
            <span className="text-[10px] text-on-surface-variant">kcal</span>
          </div>
          <p className="text-[10px] text-on-surface-variant mt-1">Goal: {calorieGoal}</p>
          <div className="mt-4 h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-container rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(calorieProgress, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Protein Card */}
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10">
          <p className="font-label text-on-surface-variant text-[10px] uppercase tracking-wider mb-1">Protein</p>
          <div className="flex items-baseline gap-1">
            <span className="font-headline text-2xl font-extrabold text-secondary-container">
              {totalProtein}
            </span>
            <span className="text-[10px] text-on-surface-variant">g</span>
          </div>
          <p className="text-[10px] text-on-surface-variant mt-1">Goal: {proteinGoal}g</p>
          <div className="mt-4 h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary-container rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(proteinProgress, 100)}%` }}
            ></div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h2 className="font-headline text-lg font-bold text-on-surface">Weekly Trends</h2>
          <div className="flex gap-3 mb-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary-container"></div>
              <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-tighter">Cal</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-secondary-container"></div>
              <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-tighter">Prot</span>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
          <div className="flex items-end justify-between h-32 gap-3">
            {weeklyData.map((data, i) => {
              const calHeight = Math.min((data.calories / calorieGoal) * 100, 100);
              const protHeight = Math.min((data.protein / proteinGoal) * 100, 100);
              const isToday = i === weeklyData.length - 1;
              
              return (
                <div key={i} className="flex flex-col items-center flex-1 gap-2 h-full justify-end">
                  <div className="flex items-end gap-1 w-full h-full">
                    <div
                      className={`flex-1 rounded-t-sm transition-all duration-1000 ${
                        isToday ? "bg-primary-container shadow-[0_0_15px_rgba(217,119,87,0.2)]" : "bg-primary-container/40"
                      }`}
                      style={{ height: `${Math.max(calHeight, 2)}%` }}
                    ></div>
                    <div
                      className={`flex-1 rounded-t-sm transition-all duration-1000 ${
                        isToday ? "bg-secondary-container shadow-[0_0_15px_rgba(100,200,100,0.2)]" : "bg-secondary-container/40"
                      }`}
                      style={{ height: `${Math.max(protHeight, 2)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-medium">
                    {data.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-4 pb-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-headline text-lg font-bold text-on-surface">Recent Meals</h2>
          <button className="text-xs font-bold text-primary-container uppercase tracking-widest hover:opacity-80">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentMeals.map((meal) => (
            <div
              key={meal.id}
              className="bg-surface-container rounded-xl p-4 flex items-center justify-between group hover:bg-surface-bright transition-colors cursor-pointer border border-transparent hover:border-outline-variant/20"
            >
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-on-surface">{meal.name}</h3>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  {meal.time} • {meal.category}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary-container">+{meal.calories}</p>
                <p className="text-[10px] text-on-surface-variant">kcal</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
