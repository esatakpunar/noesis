"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, type CategoryId } from "@/lib/categories";

interface Entry {
  id: string;
  createdAt: string | Date;
  notes: string | null;
  topic: { title: string; category: string };
}

export default function CodexEntries({ entries }: { entries: Entry[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (category && e.topic.category !== category) return false;
      if (q && !e.topic.title.toLowerCase().includes(q) && !e.notes?.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [entries, query, category]);

  const usedCategories = useMemo(
    () => new Set(entries.map((e) => e.topic.category)),
    [entries],
  );

  return (
    <div>
      {entries.length > 3 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ara…"
            className="bg-ink-soft border border-ink-line px-3 py-1.5 text-sm text-paper placeholder:text-paper-dim/50 focus:outline-none focus:border-accent w-40"
          />
          {CATEGORIES.filter((c) => usedCategories.has(c.id)).map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(category === c.id ? null : c.id)}
              className={`px-2.5 py-1 rounded-full font-mono text-[0.65rem] uppercase tracking-wide border transition-colors ${
                category === c.id
                  ? "border-accent bg-accent-soft text-paper"
                  : "border-ink-line text-paper-dim hover:border-paper-dim"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-paper-dim text-sm">Eşleşen kayıt yok.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((e) => (
            <li key={e.id} className="border-b border-ink-line pb-4">
              <div className="flex items-baseline justify-between">
                <span className="font-display italic text-2xl">{e.topic.title}</span>
                <span className="font-mono text-xs text-paper-dim">
                  {new Date(e.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
              {e.notes && <p className="text-paper-dim text-sm mt-1 line-clamp-2">{e.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
