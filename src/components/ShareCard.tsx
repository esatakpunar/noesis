import { forwardRef } from "react";
import { CATEGORIES, DIFFICULTY_LABEL, type Topic } from "@/lib/categories";
import type { SpeechAnalytics } from "@/lib/speech";

const ShareCard = forwardRef<
  HTMLDivElement,
  { topic: Topic; analytics: SpeechAnalytics }
>(function ShareCard({ topic, analytics }, ref) {
  const categoryLabel = CATEGORIES.find((c) => c.id === topic.category)?.label;

  return (
    <div
      ref={ref}
      style={{
        width: 540,
        height: 540,
        background: "#14110d",
        color: "#ede4d3",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 48,
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#a89a80",
        }}
      >
        noesis · zihin arşivi
      </div>

      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#c1442e",
            marginBottom: 12,
          }}
        >
          {categoryLabel} · {DIFFICULTY_LABEL[topic.difficulty]}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 56,
            lineHeight: 1.1,
          }}
        >
          {topic.title}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Stat label="Kelime/Dk" value={analytics.wpm} />
        <Stat label="Dolgu Kelime" value={analytics.fillerCount} />
        <Stat label="Netlik" value={`${analytics.clarityScore}/100`} />
      </div>
    </div>
  );
});

export default ShareCard;

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 500 }}>{value}</div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#a89a80",
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}
