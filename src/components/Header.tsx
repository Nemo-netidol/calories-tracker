import React from "react";
import { test } from "../services/foodService"

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 glass-header flex justify-between items-center px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant/20">
          <img
            src="https://gametora.com/images/umamusume/characters/chara_stand_1065_106501.png"
            alt="Profile"
            className="w-full h-full object-cover"
            onClick={test}
          />
        </div>
        <h1 className="text-xl font-extrabold text-stone-100 font-headline tracking-tight">Nutrition</h1>
      </div>
      <button className="material-symbols-outlined text-stone-400 p-2 hover:bg-stone-800/50 rounded-lg transition-colors">
        search
      </button>
    </header>
  );
}
