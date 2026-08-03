"use client";

import { useState } from "react";
import type { Topic } from "@/lib/categories";
import type { SpeechAnalytics } from "@/lib/speech";
import ShareModal from "@/components/ShareModal";

export default function ResultStage({
  topic,
  analytics,
  onRestart,
}: {
  topic: Topic;
  analytics: SpeechAnalytics;
  onRestart: () => void;
}) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center radial-glow">
      <span className="font-mono text-xs uppercase tracking-widest text-paper-dim mb-2">
        Kodekse Eklendi
      </span>
      <h1 className="font-display italic text-5xl mb-10">{topic.title}</h1>

      <div className="grid grid-cols-3 gap-6 sm:gap-12 mb-4">
        <Stat label="Kelime/Dk" value={analytics.wpm} hint="İdeal: 120-160" />
        <Stat label="Dolgu Kelime" value={analytics.fillerCount} hint='"şey", "yani" vb.' />
        <Stat label="Netlik" value={`${analytics.clarityScore}`} suffix="/100" hint="Hız + dolgu kelime" />
      </div>

      <p className="text-paper-dim text-sm max-w-sm mb-12">{feedbackFor(analytics)}</p>

      <div className="flex gap-3">
        <button
          onClick={() => setShareOpen(true)}
          className="px-8 py-4 border border-accent text-accent font-mono text-sm uppercase tracking-widest hover:bg-accent hover:text-ink transition-colors"
        >
          Kartını Paylaş
        </button>
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-accent text-ink font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Yeni Konu Keşfet →
        </button>
      </div>

      {shareOpen && (
        <ShareModal topic={topic} analytics={analytics} onClose={() => setShareOpen(false)} />
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
  hint,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  hint: string;
}) {
  return (
    <div title={hint}>
      <div className="font-mono text-4xl tabular-nums">
        {value}
        {suffix && <span className="text-paper-dim text-xl">{suffix}</span>}
      </div>
      <div className="font-mono text-xs uppercase tracking-widest text-paper-dim mt-1">
        {label}
      </div>
      <div className="text-[0.65rem] text-paper-dim/70 mt-0.5">{hint}</div>
    </div>
  );
}

function feedbackFor(analytics: { wpm: number; clarityScore: number }): string {
  if (analytics.clarityScore >= 80) return "Akıcı ve net bir anlatımdı — bu tempoyu koru.";
  if (analytics.wpm > 170) return "Biraz hızlı konuştun — bir tık yavaşlamak netliği artırır.";
  if (analytics.wpm < 100) return "Biraz yavaş konuştun — enerjini artırmayı dene.";
  return "İyi bir başlangıç — dolgu kelimeleri azaltmak netliği artırır.";
}
