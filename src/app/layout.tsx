import type { Metadata } from "next";
import { Instrument_Serif, Literata, IBM_Plex_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import AuthHeader from "@/components/AuthHeader";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-display-raw",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const body = Literata({
  variable: "--font-body-raw",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-raw",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// VERCEL_URL değişkeni deploy'a özel geçici alt alan adı verir (canonical
// değil) — bu yüzden sabit production alias kullanılıyor. Custom domain
// bağlanınca burayı güncelle.
const siteUrl = "https://noesis-seven-wheat.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "noesis — Zihnini Yapay Zekadan Önce Sen Kullan",
  description:
    "15 dakika araştır, 2 dakikada diksiyonla anlat. Sosyal medyanın yarattığı zihinsel uyuşukluğa karşı günlük bir alışkanlık.",
  openGraph: {
    title: "noesis — Zihnini Yapay Zekadan Önce Sen Kullan",
    description: "15 dakika araştır, 2 dakikada diksiyonla anlat.",
    siteName: "noesis",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "noesis — Zihnini Yapay Zekadan Önce Sen Kullan",
    description: "15 dakika araştır, 2 dakikada diksiyonla anlat.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="tr"
        className={`${display.variable} ${body.variable} ${mono.variable} h-full`}
      >
        <body className="min-h-full flex flex-col bg-ink text-paper font-body antialiased">
          <div className="grain" aria-hidden="true" />
          <AuthHeader />
          {children}
          <footer className="relative z-10 flex items-center justify-center gap-4 py-4 font-mono text-[0.65rem] text-paper-dim/60 border-t border-ink-line">
            <a href="/terms" className="hover:text-accent transition-colors">
              Kullanım Koşulları
            </a>
            <span>·</span>
            <a href="/privacy" className="hover:text-accent transition-colors">
              Gizlilik
            </a>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
