"use client";

// Gemini isteği süresince gösterilen "çark" efekti — gerçek başlıklar henüz
// bilinmediği için kurgusal olduğu belli olmayan gerçek konu adı YAZMIYORUZ,
// atmosfer taşıyan tanıtım kelimeleri döndürüyoruz. Hızlı akış + hafif blur
// slot-machine hissini verir; kısa süre içinde tekrar fark edilmesin diye
// liste geniş tutuldu.
const TEASERS = [
  "Kadim…",
  "Nadir…",
  "Tuhaf…",
  "Gizli…",
  "Unutulmuş…",
  "Şaşırtıcı…",
  "Esrarlı…",
  "Antik…",
  "Sıradışı…",
  "Bilinmez…",
  "Keşfedilmemiş…",
  "Derin…",
  "Saklı…",
  "Uzak…",
  "Yabancı…",
  "Fevkalade…",
];

// Kusursuz döngü için liste iki kez art arda eklenir.
const REEL_ITEMS = [...TEASERS, ...TEASERS];
const SECONDS_PER_ITEM = 0.12;

export default function TopicReel() {
  return (
    <div
      className="relative h-14 overflow-hidden"
      style={{
        maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
      }}
    >
      <ul className="animate-reel" style={{ filter: "blur(0.6px)" }}>
        {REEL_ITEMS.map((label, i) => (
          <li
            key={i}
            className="h-14 flex items-center justify-center font-display italic text-3xl text-paper-dim"
          >
            {label}
          </li>
        ))}
      </ul>

      <style>{`
        @keyframes reel-scroll {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        .animate-reel {
          animation: reel-scroll ${TEASERS.length * SECONDS_PER_ITEM}s linear infinite;
        }
      `}</style>
    </div>
  );
}
