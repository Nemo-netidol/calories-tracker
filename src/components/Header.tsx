import React from "react";
import { useUserStore } from "../zustand";

export function Header() {
  const user = useUserStore((state) => state.user)
  const initial = user?.username?.trim()?.[0]?.toUpperCase() ?? "?";
  return (
    <header className="fixed top-0 left-0 w-full z-sticky glass-header flex justify-between items-center px-6 py-3">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20 shadow-sm"
          aria-hidden="true"
        >
          <span className="font-headline text-sm font-black text-primary">{initial}</span>
        </div>
        <h1 className="text-lg font-bold text-on-surface font-headline tracking-tight">
          Hey, {user?.username}
        </h1>
      </div>

      <label
        className="swap swap-rotate text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        aria-label="Toggle dark theme"
      >
        <input type="checkbox" className="theme-controller" value="coachdark" />
        <span className="swap-off material-symbols-outlined text-2xl">light_mode</span>
        <span className="swap-on material-symbols-outlined text-2xl">dark_mode</span>
      </label>
    </header>
  );
}
