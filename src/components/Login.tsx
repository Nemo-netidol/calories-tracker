import React, { useState } from "react";

interface LoginProps {
  onLogin: (password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function Login({ onLogin, isLoading, error }: LoginProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onLogin(password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-6">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-primary/10 text-primary mb-6 shadow-xl shadow-primary/5">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              lock
            </span>
          </div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface mb-2">Welcome Back</h1>
          <p className="text-on-surface-variant font-medium">Please enter your access password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
              Access Password
            </label>
            <div className={`relative transition-all duration-300 rounded-3xl p-1 bg-surface-container-high border-2 ${
              error ? 'border-error/30 shadow-lg shadow-error/5' : 'border-outline-variant/20 focus-within:border-primary shadow-xl shadow-black/5'
            }`}>
              <input
                type="password"
                placeholder="••••••••"
                autoFocus
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface px-5 py-4 font-headline text-xl tracking-widest placeholder:tracking-normal placeholder:text-outline-variant"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-error text-xs font-bold animate-in slide-in-from-top-1 duration-300 ml-1">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="group relative w-full py-5 rounded-3xl bg-primary text-on-primary font-headline font-bold text-lg shadow-2xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              {isLoading ? (
                <span className="animate-spin material-symbols-outlined">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">login</span>
              )}
              <span>{isLoading ? "Authenticating..." : "Unlock Dashboard"}</span>
            </div>
            
            {/* Gloss reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
          </button>
        </form>

        <p className="mt-12 text-center text-xs text-outline font-medium uppercase tracking-[0.2em] opacity-40">
          Personal Nutrition Records &bull; Encrypted Session
        </p>
      </div>
    </div>
  );
}
