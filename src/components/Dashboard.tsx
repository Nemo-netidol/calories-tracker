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

  // Colors from theme
  const PRIMARY_COLOR = "#d97757";
  const SECONDARY_COLOR = "#03a68d";

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-container-highest p-3 rounded-xl border border-outline-variant/20 shadow-xl">
          <p className="font-headline text-xs font-bold text-on-surface mb-2">{payload[0].payload.day}</p>
          <div className="space-y-1">
            <p className="text-[10px] text-primary-container font-bold uppercase tracking-wider">
              Calories: {payload[0].value} kcal
            </p>
            <p className="text-[10px] text-secondary-container font-bold uppercase tracking-wider">
              Protein: {payload[1].value} g
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 duration-500">
      <section className="grid grid-cols-2 gap-4 mt-4">
        {/* Calories Card */}
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 shadow-sm">
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
              className="h-full bg-primary-container rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(217,119,87,0.3)]"
              style={{ width: `${Math.min(calorieProgress, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Protein Card */}
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 shadow-sm">
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
              className="h-full bg-secondary-container rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(3,166,141,0.3)]"
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
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10, fontWeight: 500 }}
                dy={10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar
                dataKey="calories"
                fill={PRIMARY_COLOR}
                radius={[4, 4, 0, 0]}
                barSize={12}
              >
                {weeklyData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === weeklyData.length - 1 ? PRIMARY_COLOR : `${PRIMARY_COLOR}66`}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="protein"
                fill={SECONDARY_COLOR}
                radius={[4, 4, 0, 0]}
                barSize={12}
              >
                {weeklyData.map((_, index) => (
                  <Cell
                    key={`cell-p-${index}`}
                    fill={index === weeklyData.length - 1 ? SECONDARY_COLOR : `${SECONDARY_COLOR}66`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
