import React from "react";
import type { View } from "../types";

interface BottomNavProps {
  activeView: View;
  setView: (v: View) => void;
}

export function BottomNav({ activeView, setView }: BottomNavProps) {
  const items: { id: View; label: string; icon: string }[] = [
    { id: "dashboard", label: "Home", icon: "dashboard" },
    { id: "log", label: "Log", icon: "description" },
    { id: "coach", label: "Coach", icon: "forum" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-3 pb-8 px-4 bg-[#1C1B1A] border-t border-stone-800/30 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] rounded-t-3xl">
      {items.slice(0, 2).map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center justify-center transition-all ${
            activeView === item.id ? "text-primary-container scale-110" : "text-stone-500 hover:text-orange-400"
          }`}
        >
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: activeView === item.id ? "'FILL' 1" : "" }}>
            {item.icon}
          </span>
          <span className="font-headline text-[10px] font-semibold tracking-wide uppercase">{item.label}</span>
        </button>
      ))}

      <button
        onClick={() => setView("add")}
        className="relative -top-6 w-14 h-14 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform shadow-primary-container/20"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {items.slice(2).map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center justify-center transition-all ${
            activeView === item.id ? "text-primary-container scale-110" : "text-stone-500 hover:text-orange-400"
          }`}
        >
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: activeView === item.id ? "'FILL' 1" : "" }}>
            {item.icon}
          </span>
          <span className="font-headline text-[10px] font-semibold tracking-wide uppercase">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
