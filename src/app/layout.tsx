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

export const metadata: Metadata = {
  title: "noesis",
  description: "15 dakika araştır, 2 dakikada diksiyonla anlat.",
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
        </body>
      </html>
    </ClerkProvider>
  );
}
