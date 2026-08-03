"use client";

import { SignUpButton } from "@clerk/nextjs";

const STEPS = [
  {
    n: "01",
    title: "Keşfet",
    body: "Nadir bir kelime, psikolojik etki ya da bilimsel fenomen — hiç duymadığın bir kavram önüne gelir.",
  },
  {
    n: "02",
    title: "Araştır",
    body: "15 dakika boyunca kendi imkanlarınla derinlemesine araştırır, notlarını çıkarırsın.",
  },
  {
    n: "03",
    title: "Anlat",
    body: "2 dakikada, tıpkı bir dinleyiciye anlatır gibi, akıcı ve net bir diksiyonla sunarsın.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative flex-1 flex flex-col items-center px-6 py-20 radial-glow">
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
        <span className="font-mono text-xs tracking-[0.3em] text-paper-dim uppercase mb-6">
          noesis · zihin arşivi
        </span>

        <h1 className="font-display italic text-5xl sm:text-7xl leading-none mb-6">
          Zihnini <span className="text-accent">Yapay Zekadan</span> Önce Sen Kullan
        </h1>

        <p className="text-paper-dim max-w-lg mb-10 leading-relaxed">
          Sosyal medyanın yarattığı zihinsel uyuşukluğa karşı bir alışkanlık. Her gün
          yeni, hiç duymadığın bir kavramı 15 dakikada araştır; 2 dakikada, kendi
          cümlelerinle, diksiyonla anlat. Hiç kopyala-yapıştır yok.
        </p>

        <SignUpButton mode="modal">
          <button className="px-10 py-4 bg-accent text-ink font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-opacity">
            Ücretsiz Başla →
          </button>
        </SignUpButton>
        <p className="mt-3 font-mono text-[0.65rem] text-paper-dim/70">
          Kredi kartı gerekmez · günde 5 konu ücretsiz
        </p>
      </div>

      <div className="relative z-10 w-full max-w-3xl grid sm:grid-cols-3 gap-8 mt-20 text-left">
        {STEPS.map((s) => (
          <div key={s.n} className="border-t border-ink-line pt-4">
            <span className="font-mono text-accent text-sm">{s.n}</span>
            <h2 className="font-display italic text-2xl mt-1 mb-2">{s.title}</h2>
            <p className="text-paper-dim text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
