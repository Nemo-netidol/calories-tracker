import React, { useEffect, useRef } from "react";

interface LogFoodSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onManual: () => void;
  onChat: () => void;
  onImageSelected: (file: File) => void;
  isProcessing?: boolean;
}

export function LogFoodSheet({ isOpen, onClose, onManual, onChat, onImageSelected, isProcessing = false }: LogFoodSheetProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const firstActionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    firstActionRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageSelected(file);
    e.target.value = "";
  };

  return (
    <div
      className="fixed inset-0 z-modal flex items-end justify-center animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="log-sheet-title"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={isProcessing ? undefined : onClose}
      ></div>

      <div className="relative z-10 w-full max-w-2xl bg-surface-container rounded-t-[2.5rem] p-8 pb-10 border-t border-x border-outline shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="w-10 h-1.5 bg-outline-variant rounded-full mx-auto mb-6"></div>

        <div className="text-center mb-8">
          <h3 id="log-sheet-title" className="font-headline text-2xl font-black text-on-surface tracking-tighter mb-1">Log a Meal</h3>
          <p className="text-on-surface-variant text-sm font-medium">How would you like to add this?</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            ref={firstActionRef}
            onClick={() => cameraInputRef.current?.click()}
            disabled={isProcessing}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-surface-container-low border border-outline hover:border-primary/40 hover:bg-surface-container-high transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {isProcessing ? (
              <span className="animate-spin material-symbols-outlined text-3xl text-primary">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-3xl text-primary">photo_camera</span>
            )}
            <span className="font-headline font-bold text-sm text-on-surface">
              {isProcessing ? "Analyzing..." : "Take a Picture"}
            </span>
          </button>

          <button
            onClick={() => galleryInputRef.current?.click()}
            disabled={isProcessing}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-surface-container-low border border-outline hover:border-primary/40 hover:bg-surface-container-high transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            <span className="material-symbols-outlined text-3xl text-primary">photo_library</span>
            <span className="font-headline font-bold text-sm text-on-surface">Choose from Gallery</span>
          </button>
        </div>

        <button
          onClick={onManual}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-3 p-5 rounded-[2rem] bg-surface-container-low border border-outline hover:border-secondary/40 hover:bg-surface-container-high transition-all active:scale-95 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-2xl text-secondary">edit_note</span>
          <span className="font-headline font-bold text-sm text-on-surface">Fill Manually</span>
        </button>

        <button
          onClick={onChat}
          disabled={isProcessing}
          className="w-full mt-4 flex items-center justify-center gap-3 p-5 rounded-[2rem] bg-surface-container-low border border-outline hover:border-outline-variant hover:bg-surface-container-high transition-all active:scale-95 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-2xl text-on-surface">chat</span>
          <span className="font-headline font-bold text-sm text-on-surface">Chat</span>
        </button>

        <button
          onClick={onClose}
          disabled={isProcessing}
          className="w-full mt-6 text-on-surface-variant font-label text-sm font-semibold uppercase tracking-widest hover:text-on-surface transition-colors py-2 disabled:opacity-50"
        >
          Cancel
        </button>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
