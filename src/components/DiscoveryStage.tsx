"use client";

import { useState } from "react";
import { CATEGORIES, DIFFICULTY_LABEL, type CategoryId, type Topic } from "@/lib/categories";
import { getWeeklyChallenge } from "@/lib/weeklyChallenge";

export default function DiscoveryStage({
  onBegin,
}: {
  onBegin: (topic: Topic) => void;
}) {
  const [weekly] = useState(() => getWeeklyChallenge());
  const weeklyLabel = CATEGORIES.find((c) => c.id === weekly.category)?.label;
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTopic() {
    setLoading(true);
    setError(null);
    setTopic(null);
    try {
      const res = await fetch("/api/topics/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category ? { category } : {}),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Konu getirilemedi");
      }
      setTopic(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Konu üretilirken bir sorun oldu. Tekrar dene.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-16 radial-glow">
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
        <span className="font-mono text-xs tracking-[0.3em] text-paper-dim uppercase mb-6">
          noesis · zihin arşivi
        </span>

        <h1 className="font-display italic text-5xl sm:text-6xl leading-none mb-4">
          Bugün ne <span className="text-accent">kavrayacaksın?</span>
        </h1>
        <p className="text-paper-dim max-w-md mb-10">
          15 dakika araştır, 2 dakikada diksiyonla anlat. Her seferinde özgün,
          hiç görmediğin bir kavram.
        </p>

        <button
          onClick={() => setCategory(weekly.category)}
          className="mb-8 flex items-center gap-2 px-4 py-2 border border-ink-line hover:border-accent transition-colors font-mono text-xs uppercase tracking-wide text-paper-dim hover:text-paper"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Haftanın Meydan Okuması: {weeklyLabel}
        </button>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <CategoryChip
            active={category === null}
            label="Fark Etmez"
            onClick={() => setCategory(null)}
          />
          {CATEGORIES.map((c) => (
            <CategoryChip
              key={c.id}
              active={category === c.id}
              label={c.label}
              onClick={() => setCategory(c.id)}
            />
          ))}
        </div>

        <button
          onClick={fetchTopic}
          disabled={loading}
          className="group relative px-8 py-3 border border-accent text-accent font-mono text-sm uppercase tracking-widest hover:bg-accent hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          {loading ? "Aranıyor…" : "Konu Getir"}
        </button>

        {error && <p className="mt-4 text-sm text-accent">{error}</p>}

        {topic && (
          <div className="mt-12 w-full border-t border-ink-line pt-10 animate-[reveal_0.5s_ease-out]">
            <div className="flex items-center justify-center gap-3 mb-3 font-mono text-xs uppercase tracking-widest text-paper-dim">
              <span>{CATEGORIES.find((c) => c.id === topic.category)?.label}</span>
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>{DIFFICULTY_LABEL[topic.difficulty]}</span>
            </div>

            <h2 className="font-display italic text-6xl sm:text-7xl mb-3">{topic.title}</h2>

            {topic.pronunciation && (
              <p className="font-mono text-paper-dim text-sm mb-1">/{topic.pronunciation}/</p>
            )}
            {topic.origin && <p className="text-paper-dim text-sm mb-8">{topic.origin}</p>}

            <button
              onClick={() => onBegin(topic)}
              className="mt-6 px-10 py-4 bg-accent text-ink font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Araştırmaya Başla →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function CategoryChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-wide border transition-colors ${
        active
          ? "border-accent bg-accent-soft text-paper"
          : "border-ink-line text-paper-dim hover:border-paper-dim"
      }`}
    >
      {label}
    </button>
  );
}
