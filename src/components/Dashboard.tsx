import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import type { FoodItem } from "../types";
import { FoodLog } from "./FoodLog";

interface MacroRingProps {
  icon: string;
  label: string;
  value: number;
  goal: number;
  progress: number;
  color: string;
}

function MacroRing({ icon, label, value, goal, progress, color }: MacroRingProps) {
  const radius = 26;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(progress, 0), 100);
  const dashOffset = circumference * (1 - clamped / 100);

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative w-16 h-16">
        <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
          <circle cx="32" cy="32" r={radius} fill="none" stroke={color} strokeOpacity={0.15} strokeWidth={strokeWidth} />
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-xl" style={{ color }}>{icon}</span>
        </div>
      </div>
      <p className="text-body-sm font-bold text-on-surface-variant">{label}</p>
      <p className="text-caption font-bold text-on-surface">
        {value} <span className="text-on-surface-variant font-medium">/ {goal}g</span>
      </p>
    </div>
  );
}

interface DashboardProps {
  totalCalories: number;
  calorieGoal: number;
  totalProtein: number;
  proteinGoal: number;
  totalCarbs: number;
  carbsGoal: number;
  totalFat: number;
  fatGoal: number;
  recentMeals: FoodItem[];
  weeklyData: { day: string; calories: number; protein: number; isToday?: boolean }[];
  onQuickLog?: (item: Omit<FoodItem, "id">) => Promise<void>;
  foodLog: FoodItem[];
  onDeleteFood: (id: string) => void;
  onUpdateFood: (id: string, updates: Partial<FoodItem>) => void;
  onViewLog: () => void;
}

export function Dashboard({
  totalCalories,
  calorieGoal,
  totalProtein,
  proteinGoal,
  totalCarbs,
  carbsGoal,
  totalFat,
  fatGoal,
  recentMeals,
  weeklyData,
  onQuickLog,
  foodLog,
  onDeleteFood,
  onUpdateFood,
  onViewLog,
}: DashboardProps) {
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const calorieProgress = (totalCalories / calorieGoal) * 100;
  const proteinProgress = (totalProtein / proteinGoal) * 100;
  const carbsProgress = carbsGoal > 0 ? (totalCarbs / carbsGoal) * 100 : 0;
  const fatProgress = fatGoal > 0 ? (totalFat / fatGoal) * 100 : 0;

  const caloriesRemaining = calorieGoal - totalCalories;
  const isOverCalorieGoal = caloriesRemaining < 0;
  const ringPercent = Math.min(Math.max(calorieProgress, 0), 100);
  // Over-goal gets a warning tone, not the destructive-delete red — going
  // over budget and permanently destroying data aren't the same register.
  const ringColor = isOverCalorieGoal ? "var(--color-warning)" : "var(--color-primary)";
  const ringRadius = 80;
  const ringStrokeWidth = 16;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference * (1 - ringPercent / 100);

  const [loggingState, setLoggingState] = useState<'idle' | 'logging-1' | 'logging-1.5' | 'success-1' | 'success-1.5' | 'error-1' | 'error-1.5'>('idle');
  const isLogging = loggingState.startsWith('logging');

  const handleQuickLog = async (scoops: 1 | 1.5) => {
    if (!onQuickLog) return;

    const suffix = scoops === 1 ? '1' : '1.5';
    setLoggingState(`logging-${suffix}` as any);

    const protein = scoops === 1 ? 25 : 37.5;
    const calories = scoops === 1 ? 150 : 225;
    const name = `Protein Shake (${scoops} Scoop${scoops > 1 ? 's' : ''})`;
    const todayISO = new Date().toISOString().slice(0, 10);
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
      setLoggingState(`error-${suffix}` as any);
      setTimeout(() => {
        setLoggingState('idle');
      }, 2000);
    }
  };

  // Claude-inspired colors
  const PRIMARY_COLOR = "#d97757"; // Orange
  const SECONDARY_COLOR = "#40b3a2"; // Teal

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const caloriesEntry = payload.find((p: any) => p.dataKey === "calories");
    const proteinEntry = payload.find((p: any) => p.dataKey === "protein");

    return (
      <div className="bg-surface-container-highest p-3 rounded-2xl border border-outline shadow-2xl backdrop-blur-md">
        <p className="font-headline text-caption font-bold text-on-surface mb-2 uppercase tracking-widest">{payload[0].payload.day}</p>
        <div className="space-y-1.5">
          {caloriesEntry && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <p className="text-caption text-on-surface font-medium">
                {caloriesEntry.value} kcal
              </p>
            </div>
          )}
          {proteinEntry && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
              <p className="text-caption text-on-surface font-medium">
                {proteinEntry.value} g protein
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const DayTick = ({ x, y, payload }: any) => {
    const entry = weeklyData[payload.index];
    const isToday = !!entry?.isToday;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          dy={10}
          textAnchor="middle"
          fill={isToday ? "var(--color-primary)" : "var(--color-on-surface-variant)"}
          fontSize={8}
          fontWeight={isToday ? 800 : 600}
        >
          {payload.value}
        </text>
        {isToday && <circle cx={0} cy={20} r={1.5} fill="var(--color-primary)" />}
      </g>
    );
  };

  const TodayCaloriesLabel = (props: any) => {
    const { x, y, width, value, index } = props;
    const entry = weeklyData[index];
    if (!entry?.isToday) return null;
    return (
      <text
        x={x + width / 2}
        y={y - 6}
        textAnchor="middle"
        fill="var(--color-primary)"
        fontSize={9}
        fontWeight={800}
      >
        {value}
      </text>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Stats Section */}
      <section className="mt-6 space-y-4">
        {/* Large Calorie Card */}
        <div className="relative bg-surface-container rounded-[2rem] p-6 sm:p-8 border border-outline overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-[200px] h-[200px]">
              <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
                <circle
                  cx="100" cy="100" r={ringRadius}
                  fill="none"
                  stroke={ringColor}
                  strokeOpacity={0.15}
                  strokeWidth={ringStrokeWidth}
                />
                <circle
                  cx="100" cy="100" r={ringRadius}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth={ringStrokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringDashOffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-label text-on-surface-variant text-label uppercase tracking-[0.2em] font-bold mb-1">
                  {isOverCalorieGoal ? "Over Goal" : "Remaining"}
                </p>
                <h2 className="font-headline text-display font-black text-on-surface tracking-tighter">
                  {Math.abs(caloriesRemaining).toLocaleString()}
                </h2>
                <span className="font-label text-label text-on-surface-variant font-bold mt-1">kcal</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-caption text-on-surface-variant font-bold uppercase tracking-wider mb-0.5">Consumed</p>
                <p className="font-headline text-body-sm font-bold text-on-surface">{totalCalories.toLocaleString()}</p>
              </div>
              <div className="w-px h-8 bg-outline"></div>
              <div className="text-center">
                <p className="text-caption text-on-surface-variant font-bold uppercase tracking-wider mb-0.5">Goal</p>
                <p className="font-headline text-body-sm font-bold text-on-surface">{calorieGoal.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nutritions - three macro rings, sized to the hero ring's language */}
        <div className="bg-surface-container rounded-3xl p-6 border border-outline">
          <h3 className="font-headline text-title font-bold text-on-surface mb-5">Nutritions</h3>
          <div className="grid grid-cols-3 gap-2">
            <MacroRing
              icon="bakery_dining"
              label="Carbs"
              value={totalCarbs}
              goal={carbsGoal}
              progress={carbsProgress}
              color="var(--color-success)"
            />
            <MacroRing
              icon="fitness_center"
              label="Protein"
              value={totalProtein}
              goal={proteinGoal}
              progress={proteinProgress}
              color="var(--color-secondary)"
            />
            <MacroRing
              icon="water_drop"
              label="Fat"
              value={totalFat}
              goal={fatGoal}
              progress={fatProgress}
              color="var(--color-warning)"
            />
          </div>
        </div>
      </section>

      {/* Quick Track Protein Shakes */}
      <section className="space-y-4">
        <h2 className="font-headline text-title font-bold text-on-surface">Quick Log</h2>
        
        <div className="bg-surface-container rounded-3xl p-6 border border-outline relative overflow-hidden group">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary transition-all group-hover:bg-primary/20">
                <span className="material-symbols-outlined font-bold text-2xl">local_bar</span>
              </div>
              <div>
                <h3 className="font-headline text-title font-extrabold text-on-surface">Protein Shake</h3>
                <p className="text-body-sm text-on-surface-variant font-medium mt-0.5">Log protein intake instantly</p>
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
                ) : loggingState === 'error-1' ? (
                  <span className="material-symbols-outlined text-error text-xl mb-1 font-bold">error</span>
                ) : (
                  <span className="font-headline text-lg font-black text-primary mb-1">1.0</span>
                )}
                <span className="font-label text-xs font-bold text-on-surface">
                  {loggingState === 'error-1' ? 'Failed — Retry' : '1 Scoop'}
                </span>
                <span className="text-caption text-on-surface-variant font-medium mt-1">25g P • 150 kcal</span>
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
                ) : loggingState === 'error-1.5' ? (
                  <span className="material-symbols-outlined text-error text-xl mb-1 font-bold">error</span>
                ) : (
                  <span className="font-headline text-lg font-black text-secondary mb-1">1.5</span>
                )}
                <span className="font-label text-xs font-bold text-on-surface">
                  {loggingState === 'error-1.5' ? 'Failed — Retry' : '1.5 Scoops'}
                </span>
                <span className="text-caption text-on-surface-variant font-medium mt-1">38g P • 225 kcal</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-label text-label font-bold text-on-surface uppercase tracking-widest">Weekly Activity</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <span className="text-caption text-on-surface-variant font-bold uppercase tracking-widest">Kcal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
              <span className="text-caption text-on-surface-variant font-bold uppercase tracking-widest">Protein</span>
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
                tick={<DayTick />}
                height={26}
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
                <LabelList dataKey="calories" content={<TodayCaloriesLabel />} />
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
          <h2 className="font-headline text-title font-bold text-on-surface">Recent</h2>
          <button
            onClick={onViewLog}
            className="font-label text-label font-bold text-primary uppercase tracking-widest hover:opacity-70 transition-opacity cursor-pointer"
          >
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
                <h3 className="text-body font-bold text-on-surface group-hover:text-primary transition-colors">{meal.name}</h3>
                <p className="text-caption text-on-surface-variant mt-1 font-medium">
                  {meal.time} • {meal.category}
                </p>
              </div>
              <div className="text-right">
                <p className="text-body font-bold text-on-surface">+{meal.calories}</p>
                <p className="text-caption text-on-surface-variant font-medium">kcal</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 pb-10">
        <button
          onClick={() => setHistoryExpanded((v) => !v)}
          className="w-full flex justify-between items-center px-1 group"
        >
          <h2 className="font-headline text-title font-bold text-on-surface group-hover:text-primary transition-colors">
            Full History
          </h2>
          <span
            className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-all"
            style={{ transform: historyExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            expand_more
          </span>
        </button>
        {historyExpanded && (
          <FoodLog foodLog={foodLog} onDelete={onDeleteFood} onUpdate={onUpdateFood} />
        )}
      </section>
    </div>
  );
}
