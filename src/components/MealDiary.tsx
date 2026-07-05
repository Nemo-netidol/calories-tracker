import React, { useState } from "react";
import type { FoodItem } from "../types";
import { Modal } from "./Modal";
import { formatAMPM, parseAMPMToInputTime, timeToMinutes } from "../utils/time";

interface MealDiaryProps {
  foodLog: FoodItem[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<FoodItem>) => void;
  onAddFood: (category: FoodItem["category"]) => void;
}

const CATEGORY_ORDER: FoodItem["category"][] = ["Breakfast", "Lunch", "Dinner", "Snack"];

const CATEGORY_ICON: Record<FoodItem["category"], string> = {
  Breakfast: "wb_twilight",
  Lunch: "wb_sunny",
  Dinner: "dark_mode",
  Snack: "cookie",
};

const getTodayISO = () => new Date().toISOString().split("T")[0];

const addDays = (dateISO: string, delta: number) => {
  // Parse and mutate in UTC throughout — mixing a local-time parse with UTC
  // serialization silently no-ops or double-jumps in positive UTC-offset zones.
  const d = new Date(dateISO + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().split("T")[0];
};

const formatDisplayDate = (dateStr: string) => {
  const today = getTodayISO();
  const yesterday = addDays(today, -1);
  const tomorrow = addDays(today, 1);

  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  if (dateStr === tomorrow) return "Tomorrow";

  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

export function MealDiary({ foodLog, selectedDate, onDateChange, onDelete, onUpdate, onAddFood }: MealDiaryProps) {
  const [itemToDelete, setItemToDelete] = useState<FoodItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{
    name: string;
    calories: number;
    protein: number;
    carbs: number | null;
    fat: number | null;
    date: string;
    time: string;
  }>({ name: "", calories: 0, protein: 0, carbs: null, fat: null, date: getTodayISO(), time: "12:00" });

  const startEditing = (item: FoodItem) => {
    setEditingId(item.id);
    setEditFields({
      name: item.name,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs ?? null,
      fat: item.fat ?? null,
      date: item.date,
      time: parseAMPMToInputTime(item.time),
    });
  };

  const handleSaveEdit = (id: string) => {
    onUpdate(id, { ...editFields, time: formatAMPM(editFields.time) });
    setEditingId(null);
  };

  const dayItems = foodLog.filter((item) => item.date === selectedDate);

  return (
    <div className="space-y-8 py-8 duration-500 animate-in fade-in slide-in-from-bottom-5">
      <Modal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            onDelete(itemToDelete.id);
            setItemToDelete(null);
          }
        }}
        title="Delete Entry?"
        message={`Remove "${itemToDelete?.name}" from your log? You'll have a few seconds to undo it after.`}
        confirmText="Delete"
        type="danger"
      />

      {/* Date navigation */}
      <div className="flex items-center justify-between bg-surface-container rounded-3xl p-4 border border-outline">
        <button
          onClick={() => onDateChange(addDays(selectedDate, -1))}
          aria-label="Previous day"
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <div className="text-center">
          <h2 className="font-headline text-title font-black text-on-surface tracking-tight">
            {formatDisplayDate(selectedDate)}
          </h2>
          <p className="text-caption text-on-surface-variant font-black uppercase tracking-[0.2em]">Meal</p>
        </div>
        <button
          onClick={() => onDateChange(addDays(selectedDate, 1))}
          aria-label="Next day"
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      {CATEGORY_ORDER.map((category) => {
        const items = dayItems
          .filter((item) => item.category === category)
          .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
        const kcalTotal = items.reduce((sum, i) => sum + i.calories, 0);

        return (
          <section key={category} className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-headline text-title font-bold text-on-surface">
                {category}
              </h3>
              <span className="font-headline text-headline font-black text-on-surface">{kcalTotal} <span className="text-caption font-bold text-on-surface-variant">kcal</span></span>
            </div>

            <div className="space-y-3">
              {items.map((item) => {
                const isEditing = editingId === item.id;

                if (isEditing) {
                  return (
                    <div key={item.id} className="bg-surface-container rounded-[2rem] p-6 border border-primary/30 shadow-lg animate-in zoom-in-95 duration-200">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-label font-black uppercase tracking-widest text-on-surface-variant ml-1">Food Name</label>
                          <input
                            type="text"
                            className="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-2 text-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                            value={editFields.name}
                            onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-label font-black uppercase tracking-widest text-on-surface-variant ml-1">Date</label>
                            <input
                              type="date"
                              className="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-2 text-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                              value={editFields.date}
                              onChange={(e) => setEditFields({ ...editFields, date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-label font-black uppercase tracking-widest text-on-surface-variant ml-1">Time</label>
                            <input
                              type="time"
                              className="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-2 text-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                              value={editFields.time}
                              onChange={(e) => setEditFields({ ...editFields, time: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-label font-black uppercase tracking-widest text-on-surface-variant ml-1">Calories (kcal)</label>
                            <input
                              type="number"
                              className="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-2 text-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                              value={editFields.calories}
                              onChange={(e) => setEditFields({ ...editFields, calories: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-label font-black uppercase tracking-widest text-on-surface-variant ml-1">Protein (g)</label>
                            <input
                              type="number"
                              className="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-2 text-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                              value={editFields.protein}
                              onChange={(e) => setEditFields({ ...editFields, protein: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-label font-black uppercase tracking-widest text-on-surface-variant ml-1">Carbs (g)</label>
                            <input
                              type="number"
                              placeholder="—"
                              className="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-2 text-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                              value={editFields.carbs ?? ""}
                              onChange={(e) => setEditFields({ ...editFields, carbs: e.target.value === "" ? null : parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-label font-black uppercase tracking-widest text-on-surface-variant ml-1">Fat (g)</label>
                            <input
                              type="number"
                              placeholder="—"
                              className="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-2 text-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                              value={editFields.fat ?? ""}
                              onChange={(e) => setEditFields({ ...editFields, fat: e.target.value === "" ? null : parseInt(e.target.value) || 0 })}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="flex-1 bg-primary text-on-primary font-bold py-2.5 rounded-xl text-xs shadow-md hover:brightness-110 transition-all active:scale-[0.98]"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 bg-surface-container-highest text-on-surface-variant font-bold py-2.5 rounded-xl text-xs hover:text-on-surface transition-all active:scale-[0.98]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="group bg-surface-container-low rounded-[2rem] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-surface-container transition-all duration-300 border border-outline hover:border-primary/30 gap-4"
                  >
                    <div className="flex items-center gap-4 sm:gap-5 flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-background flex-shrink-0 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors border border-outline">
                        <span className="material-symbols-outlined">{CATEGORY_ICON[item.category]}</span>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-caption font-black uppercase tracking-widest text-primary whitespace-nowrap">
                            {item.time}
                          </span>
                        </div>
                        <h3 className="font-headline font-bold text-body sm:text-title text-on-surface truncate leading-tight">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          <span className="text-caption text-secondary font-bold uppercase tracking-widest">
                            {item.protein}g protein
                          </span>
                          {item.carbs != null && (
                            <span className="text-caption text-success font-bold uppercase tracking-widest">
                              • {item.carbs}g carbs
                            </span>
                          )}
                          {item.fat != null && (
                            <span className="text-caption text-warning font-bold uppercase tracking-widest">
                              • {item.fat}g fat
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-outline/10">
                      <div className="text-left sm:text-right">
                        <div className="flex items-baseline gap-1 justify-start sm:justify-end">
                          <span className="font-headline font-black text-title text-on-surface">{item.calories}</span>
                          <span className="text-caption text-on-surface-variant font-bold uppercase tracking-tighter">kcal</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditing(item)}
                          className="w-10 h-10 rounded-xl bg-background sm:bg-transparent flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all active:scale-90 border border-outline sm:border-none"
                          title="Edit entry"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => setItemToDelete(item)}
                          className="w-10 h-10 rounded-xl bg-background sm:bg-transparent flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-all active:scale-90 border border-outline sm:border-none"
                          title="Delete entry"
                        >
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => onAddFood(category)}
                className="flex items-center gap-2 text-primary font-bold text-sm px-2 py-1 hover:opacity-70 transition-opacity active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Log Food
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
