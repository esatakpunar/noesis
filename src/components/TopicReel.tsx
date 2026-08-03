"use client";

// Gemini isteği süresince gösterilen "çark" efekti — gerçek başlıklar henüz
// bilinmediği için kurgusal olduğu belli olmayan gerçek konu adı YAZMIYORUZ,
// atmosfer taşıyan tanıtım cümleleri döndürüyoruz.
const TEASERS = [
  "Kadim bir kavram…",
  "Unutulmuş bir terim…",
  "Tuhaf bir fenomen…",
  "Nadir bir kelime…",
  "Gizli bir paradoks…",
  "Bilinmeyen bir köken…",
  "Şaşırtıcı bir bağlantı…",
  "Az bilinen bir gerçek…",
];

// Kusursuz döngü için liste iki kez art arda eklenir.
const REEL_ITEMS = [...TEASERS, ...TEASERS];

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
      <ul className="animate-reel">
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
          animation: reel-scroll ${TEASERS.length * 0.7}s linear infinite;
        }
      `}</style>
    </div>
  );
}
