"use client";

import { useEffect, useRef, useState } from "react";
import type { Topic } from "@/lib/categories";
import { useCountdown } from "@/lib/useCountdown";
import {
  analyzeSpeech,
  createTranscriber,
  isSpeechSupported,
  micErrorMessage,
  type SpeechAnalytics,
} from "@/lib/speech";

const TALK_SECONDS = 2 * 60;

type MicState = "idle" | "requesting" | "active" | "denied" | "manual";

export default function PresentationStage({
  topic,
  onFinish,
}: {
  topic: Topic;
  onFinish: (analytics: SpeechAnalytics) => void;
}) {
  const [micState, setMicState] = useState<MicState>("idle");
  const [micError, setMicError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [supported] = useState(isSpeechSupported());
  const startedAt = useRef<number | null>(null);
  const transcriberRef = useRef<ReturnType<typeof createTranscriber>>(null);

  const recording = micState === "active" || micState === "manual";

  const finish = () => {
    transcriberRef.current?.stop();
    const durationSeconds = startedAt.current
      ? (Date.now() - startedAt.current) / 1000
      : TALK_SECONDS;
    onFinish(analyzeSpeech(transcript, durationSeconds));
  };

  const { label, progress, remaining } = useCountdown(TALK_SECONDS, finish);

  useEffect(() => {
    return () => transcriberRef.current?.stop();
  }, []);

  function startRecording() {
    if (!supported) {
      startedAt.current = Date.now();
      setMicState("manual");
      return;
    }
    setMicState("requesting");
    setMicError(null);
    const transcriber = createTranscriber(setTranscript);
    transcriberRef.current = transcriber;
    transcriber?.onStart(() => {
      startedAt.current = Date.now();
      setMicState("active");
    });
    transcriber?.onError((error) => {
      setMicError(micErrorMessage(error));
      setMicState("denied");
    });
    transcriber?.start();
  }

  function continueWithoutMic() {
    startedAt.current = Date.now();
    setMicState("manual");
  }

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 max-w-3xl mx-auto w-full text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-paper-dim mb-2">
        Diksiyon Arenası
      </span>
      <h1 className="font-display italic text-4xl sm:text-5xl mb-8">{topic.title}</h1>

      <div className="relative w-48 h-48 mb-8">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="46" fill="none" stroke="var(--ink-line)" strokeWidth="4" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeDasharray={2 * Math.PI * 46}
            strokeDashoffset={2 * Math.PI * 46 * (1 - progress)}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-4xl tabular-nums">
          {label}
        </div>
      </div>

      {!supported && micState === "idle" && (
        <p className="text-sm text-paper-dim mb-6 max-w-sm">
          Bu tarayıcı canlı konuşma tanımayı desteklemiyor (Chrome önerilir). Yine de
          süreyi kullanıp elle anlatabilirsin — sadece konuşma analizi çıkmaz.
        </p>
      )}

      {supported && micState === "idle" && (
        <p className="text-sm text-paper-dim mb-6 max-w-sm">
          Başlarken tarayıcı mikrofon izni isteyecek — konuşma hızını ve netliğini
          ölçebilmemiz için izin vermen gerekiyor.
        </p>
      )}

      {micState === "denied" && micError && (
        <div className="mb-6 max-w-sm space-y-3">
          <p className="text-sm text-accent">{micError}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={startRecording}
              className="px-4 py-2 border border-accent text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-ink transition-colors"
            >
              Tekrar Dene
            </button>
            <button
              onClick={continueWithoutMic}
              className="px-4 py-2 border border-ink-line text-paper-dim font-mono text-xs uppercase tracking-widest hover:border-paper-dim transition-colors"
            >
              Mikrofonsuz Devam Et
            </button>
          </div>
        </div>
      )}

      {micState === "idle" || micState === "denied" ? (
        <button
          onClick={startRecording}
          disabled={remaining === 0}
          className="px-10 py-4 bg-accent text-ink font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Anlatmaya Başla
        </button>
      ) : micState === "requesting" ? (
        <p className="px-10 py-4 font-mono text-sm uppercase tracking-widest text-paper-dim">
          Mikrofon izni bekleniyor…
        </p>
      ) : (
        <button
          onClick={finish}
          className="px-10 py-4 border border-accent text-accent font-mono text-sm uppercase tracking-widest hover:bg-accent hover:text-ink transition-colors"
        >
          Bitir
        </button>
      )}

      {micState === "manual" && (
        <p className="mt-8 text-paper-dim text-sm max-w-sm">
          Mikrofonsuz devam ediyorsun — süre işliyor, konuşma analizi bu oturumda
          çıkmayacak.
        </p>
      )}

      {micState === "active" && (
        <p className="mt-8 text-paper-dim text-sm leading-relaxed max-w-lg min-h-[4rem]">
          {transcript || "…dinliyorum"}
        </p>
      )}
    </div>
  );
}
