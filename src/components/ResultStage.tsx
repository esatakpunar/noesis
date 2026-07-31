"use client";

import type { Topic } from "@/lib/categories";
import type { SpeechAnalytics } from "@/lib/speech";

export default function ResultStage({
  topic,
  analytics,
  onRestart,
}: {
  topic: Topic;
  analytics: SpeechAnalytics;
  onRestart: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center radial-glow">
      <span className="font-mono text-xs uppercase tracking-widest text-paper-dim mb-2">
        Kodekse Eklendi
      </span>
      <h1 className="font-display italic text-5xl mb-10">{topic.title}</h1>

      <div className="grid grid-cols-3 gap-6 sm:gap-12 mb-12">
        <Stat label="Kelime/Dk" value={analytics.wpm} />
        <Stat label="Dolgu Kelime" value={analytics.fillerCount} />
        <Stat label="Netlik" value={`${analytics.clarityScore}`} suffix="/100" />
      </div>

      <button
        onClick={onRestart}
        className="px-10 py-4 bg-accent text-ink font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        Yeni Konu Keşfet →
      </button>
    </div>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number | string; suffix?: string }) {
  return (
    <div>
      <div className="font-mono text-4xl tabular-nums">
        {value}
        {suffix && <span className="text-paper-dim text-xl">{suffix}</span>}
      </div>
      <div className="font-mono text-xs uppercase tracking-widest text-paper-dim mt-1">
        {label}
      </div>
    </div>
  );
}
