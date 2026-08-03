"use client";

import { WARMUP_EXERCISES } from "@/lib/warmup";

export default function WarmupModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-ink border border-ink-line p-8 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="absolute top-4 right-4 font-mono text-paper-dim hover:text-accent transition-colors"
        >
          ✕
        </button>

        <span className="font-mono text-xs uppercase tracking-widest text-paper-dim">
          Isınma
        </span>
        <h2 className="font-display italic text-3xl mb-6">Sese Gel</h2>

        <div className="space-y-6">
          {WARMUP_EXERCISES.map((ex) => (
            <div key={ex.title} className="border-t border-ink-line pt-4">
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <h3 className="font-display italic text-xl">{ex.title}</h3>
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-accent shrink-0">
                  {ex.type}
                </span>
              </div>
              <p className="text-paper-dim text-sm leading-relaxed">{ex.description}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full px-6 py-3 bg-accent text-ink font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Hazırım
        </button>
      </div>
    </div>
  );
}
