import React from "react";
import type { FoodItem } from "../types";

interface FoodLogProps {
  foodLog: FoodItem[];
  onDelete: (id: string) => void;
}

export function FoodLog({ foodLog, onDelete }: FoodLogProps) {
  // Group foods by date
  const groupedByDate = foodLog.reduce((groups, item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, FoodItem[]>);

  // Sort dates descending (newest first)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  const formatDisplayDate = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    
    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-12 py-4 duration-500 animate-in fade-in slide-in-from-bottom-5">
      {sortedDates.length === 0 ? (
        <div className="py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-outline-variant/30 mb-4 block">history_edu</span>
          <p className="font-headline text-lg font-bold text-on-surface-variant">No journal entries found</p>
          <p className="text-sm text-outline-variant">Start logging your meals to track your progress</p>
        </div>
      ) : (
        sortedDates.map((date) => {
          const items = (groupedByDate[date] || []).sort((a, b) => b.time.localeCompare(a.time));
          const dailyCalories = items.reduce((sum, i) => sum + i.calories, 0);
          const dailyProtein = items.reduce((sum, i) => sum + i.protein, 0);

          return (
            <section key={date} className="relative">
              {/* Date Header Sticky */}
              <div className="sticky top-16 z-10 bg-surface/90 backdrop-blur-md py-4 mb-6 border-b border-outline-variant/20 flex justify-between items-end">
                <div>
                  <h2 className="font-headline text-2xl font-extrabold text-on-surface">
                    {formatDisplayDate(date)}
                  </h2>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-[0.2em] mt-1">
                    {date === new Date().toISOString().split("T")[0] ? "Daily Summary" : "Archive Entry"}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <span className="block text-[10px] text-outline uppercase font-bold tracking-widest leading-none mb-1">Total Nutrients</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-primary">local_fire_department</span>
                        <span className="font-headline font-bold text-lg text-on-surface">{dailyCalories}</span>
                        <span className="text-[10px] text-outline-variant font-medium">kcal</span>
                      </div>
                      <div className="w-px h-4 bg-outline-variant/30" />
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-secondary">fitness_center</span>
                        <span className="font-headline font-bold text-lg text-on-surface">{dailyProtein}</span>
                        <span className="text-[10px] text-outline-variant font-medium">g</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative bg-surface-container-low rounded-3xl p-5 flex items-center justify-between hover:bg-surface-container-high transition-all duration-300 border border-outline-variant/10 hover:border-primary/20 hover:shadow-xl hover:shadow-black/20"
                  >
                    <div className="flex items-center gap-5 flex-1">
                      {/* Category Icon */}
                      <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-outline group-hover:text-primary transition-colors border border-outline-variant/10">
                        <span className="material-symbols-outlined">
                          {item.category === "Breakfast" ? "wb_twilight" : 
                           item.category === "Lunch" ? "wb_sunny" : 
                           item.category === "Dinner" ? "dark_mode" : "cookie"}
                        </span>
                      </div>
                      
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary px-2 py-0.5 rounded-full bg-secondary/5 border border-secondary/10">
                            {item.category}
                          </span>
                          <span className="text-xs text-outline font-medium tracking-tight bg-surface-container-highest/30 px-2 rounded-full border border-outline-variant/10">
                            {item.time}
                          </span>
                        </div>
                        <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary-container transition-colors">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <div className="flex items-baseline gap-1">
                          <span className="font-headline font-extrabold text-xl text-on-surface">{item.calories}</span>
                          <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">kcal</span>
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest bg-outline-variant/10 px-2 py-0.5 rounded-full">
                          {item.protein}g Protein
                        </span>
                      </div>
                      
                      <button
                        onClick={() => onDelete(item.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-outline-variant hover:text-error hover:bg-error/10 transition-all opacity-40 group-hover:opacity-100 active:scale-90"
                        title="Delete entry"
                      >
                        <span className="material-symbols-outlined text-xl">delete_sweep</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
