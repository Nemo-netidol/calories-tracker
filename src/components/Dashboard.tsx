import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { FoodItem } from "../types";

interface DashboardProps {
  totalCalories: number;
  calorieGoal: number;
  totalProtein: number;
  proteinGoal: number;
  recentMeals: FoodItem[];
  weeklyData: { day: string; calories: number; protein: number; isToday?: boolean }[];
  onQuickLog?: (item: Omit<FoodItem, "id">) => Promise<void>;
}

export function Dashboard({
  totalCalories,
  calorieGoal,
  totalProtein,
  proteinGoal,
  recentMeals,
  weeklyData,
  onQuickLog,
}: DashboardProps) {
  const calorieProgress = (totalCalories / calorieGoal) * 100;
  const proteinProgress = (totalProtein / proteinGoal) * 100;

  const [loggingState, setLoggingState] = useState<'idle' | 'logging-1' | 'logging-1.5' | 'success-1' | 'success-1.5'>('idle');
  const isLogging = loggingState.startsWith('logging');

  const handleQuickLog = async (scoops: 1 | 1.5) => {
    if (!onQuickLog) return;
    
    const suffix = scoops === 1 ? '1' : '1.5';
    setLoggingState(`logging-${suffix}` as any);
    
    const protein = scoops === 1 ? 25 : 38;
    const calories = scoops === 1 ? 130 : 195;
    const name = `Protein Shake (${scoops} Scoop${scoops > 1 ? 's' : ''})`;
    const todayISO = new Date().toISOString().split("T")[0];
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
    try {
      await onQuickLog({
        name,
        calories,
        protein,
        category: "Snack",
        date: todayISO,
        time,
      });
      setLoggingState(`success-${suffix}` as any);
      setTimeout(() => {
        setLoggingState('idle');
      }, 1500);
    } catch (err) {
      console.error("Failed to log protein shake:", err);
      setLoggingState('idle');
    }
  };

  // Claude-inspired colors
  const PRIMARY_COLOR = "#d97757"; // Orange
  const SECONDARY_COLOR = "#40b3a2"; // Teal

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-container-highest p-3 rounded-2xl border border-outline shadow-2xl backdrop-blur-md">
          <p className="font-headline text-[11px] font-bold text-on-surface mb-2 uppercase tracking-widest">{payload[0].payload.day}</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <p className="text-[10px] text-on-surface font-medium">
                {payload[0].value} kcal
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
              <p className="text-[10px] text-on-surface font-medium">
                {payload[1].value} g protein
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Stats Section */}
      <section className="mt-6 space-y-4">
        {/* Large Calorie Card */}
        <div className="relative bg-surface-container rounded-[2rem] p-6 sm:p-8 border border-outline overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/10"></div>
          
          <div className="relative z-10 flex justify-between items-end">
            <div className="space-y-1">
              <p className="font-label text-on-surface-variant text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold">Energy Consumed</p>
              <div className="flex items-baseline gap-2">
                <h2 className="font-headline text-4xl sm:text-5xl font-black text-on-surface tracking-tighter">
                  {totalCalories.toLocaleString()}
                </h2>
                <span className="text-sm text-on-surface-variant font-bold">kcal</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] sm:text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Daily Goal</p>
              <p className="font-headline text-base sm:text-lg font-bold text-on-surface">{calorieGoal}</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Progress</span>
              <span className="text-[10px] font-black text-primary">{Math.round(calorieProgress)}%</span>
            </div>
            <div className="h-2.5 bg-background rounded-full p-0.5 border border-outline">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(217,119,87,0.4)]"
                style={{ width: `${Math.min(calorieProgress, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Protein Secondary Card - Wide & Slim */}
        <div className="bg-surface-container rounded-3xl p-6 border border-outline flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 transition-all group-hover:bg-secondary/20">
              <span className="material-symbols-outlined text-secondary font-bold">fitness_center</span>
            </div>
            <div>
              <p className="font-label text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">Protein Intake</p>
              <div className="flex items-baseline gap-1">
                <span className="font-headline text-2xl font-black text-secondary tracking-tighter">{totalProtein}</span>
                <span className="text-[10px] text-on-surface-variant font-bold">/ {proteinGoal}g</span>
              </div>
            </div>
          </div>
          
          <div className="w-24 h-1.5 bg-background rounded-full overflow-hidden border border-outline">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(64,179,162,0.3)]"
              style={{ width: `${Math.min(proteinProgress, 100)}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Quick Track Protein Shakes */}
      <section className="space-y-4">
        <h2 className="font-headline text-sm font-bold text-on-surface uppercase tracking-widest">Quick Log</h2>
        
        <div className="bg-surface-container rounded-3xl p-6 border border-outline relative overflow-hidden group">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary transition-all group-hover:bg-primary/20">
                <span className="material-symbols-outlined font-bold text-2xl">local_bar</span>
              </div>
              <div>
                <h3 className="font-headline text-base font-extrabold text-on-surface">Protein Shake</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">Log protein intake instantly</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <button
                onClick={() => handleQuickLog(1)}
                disabled={isLogging}
                className="flex flex-col items-center justify-center p-4 bg-background hover:bg-surface-bright border border-outline hover:border-primary/30 rounded-2xl transition-all cursor-pointer active:scale-95 text-center group/btn relative min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingState === 'logging-1' ? (
                  <span className="animate-spin material-symbols-outlined text-primary text-xl mb-1">progress_activity</span>
                ) : loggingState === 'success-1' ? (
                  <span className="material-symbols-outlined text-green-500 text-xl mb-1 font-bold">check_circle</span>
                ) : (
                  <span className="font-headline text-lg font-black text-primary mb-1">1.0</span>
                )}
                <span className="font-label text-xs font-bold text-on-surface">1 Scoop</span>
                <span className="text-[10px] text-on-surface-variant font-medium mt-1">25g P • 130 kcal</span>
              </button>

              <button
                onClick={() => handleQuickLog(1.5)}
                disabled={isLogging}
                className="flex flex-col items-center justify-center p-4 bg-background hover:bg-surface-bright border border-outline hover:border-secondary/30 rounded-2xl transition-all cursor-pointer active:scale-95 text-center group/btn relative min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingState === 'logging-1.5' ? (
                  <span className="animate-spin material-symbols-outlined text-secondary text-xl mb-1">progress_activity</span>
                ) : loggingState === 'success-1.5' ? (
                  <span className="material-symbols-outlined text-green-500 text-xl mb-1 font-bold">check_circle</span>
                ) : (
                  <span className="font-headline text-lg font-black text-secondary mb-1">1.5</span>
                )}
                <span className="font-label text-xs font-bold text-on-surface">1.5 Scoops</span>
                <span className="text-[10px] text-on-surface-variant font-medium mt-1">38g P • 195 kcal</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-headline text-sm font-bold text-on-surface uppercase tracking-widest">Weekly Activity</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">Kcal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
              <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">Protein</span>
            </div>
          </div>
        </div>
        <div className="bg-surface-container rounded-[2rem] p-4 sm:p-6 border border-outline h-48 sm:h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 0, right: 5, left: 5, bottom: 0 }}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 8, fontWeight: 600 }}
                dy={10}
                interval={0}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar
                dataKey="calories"
                fill={PRIMARY_COLOR}
                radius={[2, 2, 0, 0]}
                barSize={10}
              >
                {weeklyData.map((entry: any, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isToday ? PRIMARY_COLOR : `${PRIMARY_COLOR}33`}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="protein"
                fill={SECONDARY_COLOR}
                radius={[2, 2, 0, 0]}
                barSize={10}
              >
                {weeklyData.map((entry: any, index) => (
                  <Cell
                    key={`cell-p-${index}`}
                    fill={entry.isToday ? SECONDARY_COLOR : `${SECONDARY_COLOR}33`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="space-y-4 pb-10">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-headline text-sm font-bold text-on-surface uppercase tracking-widest">Recent</h2>
          <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-70 transition-opacity">
            View Log
          </button>
        </div>
        <div className="space-y-3">
          {recentMeals.map((meal) => (
            <div
              key={meal.id}
              className="bg-surface-container rounded-2xl p-4 flex items-center justify-between group hover:bg-surface-bright transition-all duration-200 cursor-pointer border border-outline hover:border-primary/20"
            >
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{meal.name}</h3>
                <p className="text-[10px] text-on-surface-variant mt-1 font-medium">
                  {meal.time} • {meal.category}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-on-surface">+{meal.calories}</p>
                <p className="text-[10px] text-on-surface-variant font-medium">kcal</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
