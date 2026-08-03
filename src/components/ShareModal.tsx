"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import ShareCard from "@/components/ShareCard";
import type { Topic } from "@/lib/categories";
import type { SpeechAnalytics } from "@/lib/speech";

const PREVIEW_SCALE = 0.6;

export default function ShareModal({
  topic,
  analytics,
  onClose,
}: {
  topic: Topic;
  analytics: SpeechAnalytics;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function download() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `noesis-${topic.title.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-ink border border-ink-line p-6 flex flex-col items-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="absolute top-4 right-4 font-mono text-paper-dim hover:text-accent transition-colors"
        >
          ✕
        </button>

        <div style={{ width: 540 * PREVIEW_SCALE, height: 540 * PREVIEW_SCALE, overflow: "hidden" }}>
          <div style={{ transform: `scale(${PREVIEW_SCALE})`, transformOrigin: "top left" }}>
            <ShareCard ref={cardRef} topic={topic} analytics={analytics} />
          </div>
        </div>

        <button
          onClick={download}
          disabled={downloading}
          className="px-8 py-3 bg-accent text-ink font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {downloading ? "Hazırlanıyor…" : "PNG İndir"}
        </button>
      </div>
    </div>
  );
}
