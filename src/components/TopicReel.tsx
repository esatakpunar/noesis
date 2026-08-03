"use client";

// Yedek liste — havuzda yeterli gerçek konu yoksa (ör. yepyeni deploy)
// veya /api/topics/sample başarısız olursa kullanılır.
const FALLBACK_TEASERS = [
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

const MIN_ITEMS = 8;
const SECONDS_PER_ITEM = 0.12;

export default function TopicReel({ titles }: { titles?: string[] }) {
  const items = titles && titles.length >= MIN_ITEMS ? titles : FALLBACK_TEASERS;
  // Kusursuz döngü için liste iki kez art arda eklenir.
  const reelItems = [...items, ...items];

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
        {reelItems.map((label, i) => (
          <li
            key={i}
            className="h-14 flex items-center justify-center px-4 font-display italic text-3xl text-paper-dim whitespace-nowrap"
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
          animation: reel-scroll ${items.length * SECONDS_PER_ITEM}s linear infinite;
        }
      `}</style>
    </div>
  );
}
