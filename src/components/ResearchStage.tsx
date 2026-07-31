"use client";

import type { Topic } from "@/lib/categories";
import { useCountdown } from "@/lib/useCountdown";

const SPRINT_SECONDS = 15 * 60;

export default function ResearchStage({
  topic,
  notes,
  onNotesChange,
  onFinish,
}: {
  topic: Topic;
  notes: string;
  onNotesChange: (v: string) => void;
  onFinish: () => void;
}) {
  const { label, progress } = useCountdown(SPRINT_SECONDS, onFinish);

  return (
    <div className="flex-1 flex flex-col px-6 py-10 max-w-5xl mx-auto w-full">
      <header className="flex items-start justify-between border-b border-ink-line pb-6 mb-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-paper-dim">
            Araştırma Deposu
          </span>
          <h1 className="font-display italic text-4xl sm:text-5xl mt-1">{topic.title}</h1>
        </div>
        <div className="text-right shrink-0 ml-6">
          <div className="font-mono text-4xl tabular-nums">{label}</div>
          <div className="w-28 h-1 bg-ink-line mt-2 overflow-hidden">
            <div
              className="h-full bg-accent transition-[width]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 flex-1">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper-dim mb-4">
            Araştırma Soruları
          </h2>
          <ol className="space-y-4">
            {topic.researchPrompts.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-paper/90 leading-relaxed">{p}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col">
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper-dim mb-4">
            Notların
          </h2>
          <textarea
            autoFocus
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Bulduklarını buraya dök…"
            className="flex-1 min-h-[280px] bg-ink-soft border border-ink-line p-4 text-paper placeholder:text-paper-dim/60 focus:outline-none focus:border-accent resize-none leading-relaxed"
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onFinish}
          className="px-8 py-3 border border-accent text-accent font-mono text-sm uppercase tracking-widest hover:bg-accent hover:text-ink transition-colors"
        >
          Sunuma Geç →
        </button>
      </div>
    </div>
  );
}
