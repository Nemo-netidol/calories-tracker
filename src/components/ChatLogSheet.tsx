import React, { useEffect, useRef, useState } from "react";
import type { Message } from "../types";

interface ChatLogSheetProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSend: (text: string) => void;
  isSending: boolean;
}

const isErrorText = (text: string) => text.startsWith("⚠️");
const stripError = (text: string) => text.replace(/^⚠️\s*/, "");

export function ChatLogSheet({ isOpen, onClose, messages, onSend, isSending }: ChatLogSheetProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed && !isSending) {
      onSend(trimmed);
      setInput("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-sheet-title"
    >
      <div
        className="absolute inset-0"
        onClick={isSending ? undefined : onClose}
      ></div>

      <div className="relative z-10 bg-surface-container-low w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border border-outline-variant/20 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 fill-mode-both">

        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0">
          <div>
            <h2 id="chat-sheet-title" className="font-headline font-extrabold text-2xl text-on-surface">Log by Chat</h2>
            <p className="text-sm text-on-surface-variant">Tell me what you've eaten today</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-grow overflow-y-auto px-8 space-y-4 pb-4">
          {messages.map((m) => (
            <div key={m.id} className={`chat ${m.role === "user" ? "chat-end" : "chat-start"}`}>
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  m.role === "user"
                    ? "bg-primary-container text-on-primary-container rounded-tr-none"
                    : isErrorText(m.text)
                      ? "bg-error/10 text-error rounded-tl-none border border-error/20"
                      : "bg-surface-container-high text-on-surface rounded-tl-none border border-outline-variant/10"
                }`}
              >
                <p className="text-sm leading-relaxed">{isErrorText(m.text) ? stripError(m.text) : m.text}</p>
                <span className="text-[10px] opacity-50 mt-1 block text-right">{m.time}</span>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="chat chat-start" aria-live="polite">
              <div className="max-w-[80%] p-4 rounded-2xl bg-surface-container-high rounded-tl-none border border-outline-variant/10 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce"></span>
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-2 shrink-0">
          <div className="obsidian-inset rounded-2xl p-1 flex items-center">
            <input
              ref={inputRef}
              className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-stone-600 px-4 py-3 font-body text-sm disabled:opacity-50"
              placeholder="e.g. I had khao pad gai for lunch..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="p-3 bg-primary-container text-on-primary-container rounded-xl mr-1 hover:brightness-110 active:scale-90 transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {isSending ? (
                <span className="animate-spin material-symbols-outlined text-xl">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-xl">send</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
