"use client";

import { useState } from "react";
import DiscoveryStage from "@/components/DiscoveryStage";
import ResearchStage from "@/components/ResearchStage";
import PresentationStage from "@/components/PresentationStage";
import ResultStage from "@/components/ResultStage";
import type { Topic } from "@/lib/categories";
import type { SpeechAnalytics } from "@/lib/speech";

type Stage = "discovery" | "research" | "presentation" | "result";

export default function Home() {
  const [stage, setStage] = useState<Stage>("discovery");
  const [topic, setTopic] = useState<Topic | null>(null);
  const [notes, setNotes] = useState("");
  const [analytics, setAnalytics] = useState<SpeechAnalytics | null>(null);

  function reset() {
    setStage("discovery");
    setTopic(null);
    setNotes("");
    setAnalytics(null);
  }

  return (
    <main className="relative z-10 flex-1 flex flex-col">
      {stage === "discovery" && (
        <DiscoveryStage
          onBegin={(t) => {
            setTopic(t);
            setNotes("");
            setStage("research");
          }}
        />
      )}

      {stage === "research" && topic && (
        <ResearchStage
          topic={topic}
          notes={notes}
          onNotesChange={setNotes}
          onFinish={() => setStage("presentation")}
        />
      )}

      {stage === "presentation" && topic && (
        <PresentationStage
          topic={topic}
          onFinish={(result) => {
            setAnalytics(result);
            fetch("/api/codex", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                topicId: topic.id,
                notes,
                wpm: result.wpm,
                fillerWordCount: result.fillerCount,
                clarityScore: result.clarityScore,
              }),
            }).catch(() => {});
            setStage("result");
          }}
        />
      )}

      {stage === "result" && topic && analytics && (
        <ResultStage topic={topic} analytics={analytics} onRestart={reset} />
      )}
    </main>
  );
}
