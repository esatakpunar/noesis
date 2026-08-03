// Web Speech API üzerinden canlı transkripsiyon sarmalayıcısı.
// Not: sadece Chromium tabanlı tarayıcılarda çalışır (Faz 3'te sunucu taraflı
// STT ile değiştirilecek — bkz. CLAUDE.md).

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorLike {
  error: string;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const isSpeechSupported = () => getRecognitionCtor() !== null;

export function createTranscriber(onUpdate: (fullTranscript: string) => void) {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;

  const recognition = new Ctor();
  recognition.lang = "tr-TR";
  recognition.continuous = true;
  recognition.interimResults = true;

  let finalTranscript = "";

  recognition.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript + " ";
      } else {
        interim += result[0].transcript;
      }
    }
    onUpdate((finalTranscript + interim).trim());
  };

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
    onStart: (cb: () => void) => {
      recognition.onstart = cb;
    },
    onEnd: (cb: () => void) => {
      recognition.onend = cb;
    },
    onError: (cb: (error: string) => void) => {
      recognition.onerror = (e) => cb(e.error);
    },
  };
}

export function micErrorMessage(error: string): string {
  switch (error) {
    case "not-allowed":
    case "permission-denied":
      return "Mikrofon izni verilmedi. Tarayıcı ayarlarından izin verip tekrar dene — istersen mikrofonsuz da devam edebilirsin.";
    case "no-speech":
      return "Ses algılanamadı. Mikrofonuna daha yakın konuşmayı dene.";
    case "audio-capture":
      return "Mikrofon bulunamadı. Bir mikrofonun bağlı olduğundan emin ol.";
    default:
      return "Mikrofonla ilgili bir sorun oldu. Tekrar dene veya mikrofonsuz devam et.";
  }
}

const FILLER_WORDS = ["şey", "yani", "işte", "falan", "filan", "ee", "aa", "hani"];

export function analyzeSpeech(transcript: string, durationSeconds: number) {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minutes = Math.max(durationSeconds / 60, 1 / 60);
  const wpm = Math.round(wordCount / minutes);

  const fillerCount = words.filter((w) =>
    FILLER_WORDS.includes(w.toLowerCase().replace(/[.,!?]/g, "")),
  ).length;

  const fillerRatio = wordCount > 0 ? fillerCount / wordCount : 0;
  const clarityScore = Math.max(0, Math.round(100 - fillerRatio * 300 - Math.max(0, wpm - 160) * 0.3));

  return { wordCount, wpm, fillerCount, clarityScore, transcript };
}

export type SpeechAnalytics = ReturnType<typeof analyzeSpeech>;
