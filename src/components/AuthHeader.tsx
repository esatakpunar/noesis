"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import WarmupModal from "@/components/WarmupModal";
import NotificationToggle from "@/components/NotificationToggle";

export default function AuthHeader() {
  const { isSignedIn } = useUser();
  const [warmupOpen, setWarmupOpen] = useState(false);

  return (
    <>
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-ink-line">
        <Link href="/" className="font-mono text-xs tracking-[0.3em] uppercase text-paper-dim">
          noesis
        </Link>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setWarmupOpen(true)}
            className="font-mono text-xs uppercase tracking-widest text-paper-dim hover:text-accent transition-colors"
          >
            Isınma
          </button>

          {isSignedIn ? (
            <>
              <Link
                href="/codex"
                className="font-mono text-xs uppercase tracking-widest text-paper-dim hover:text-accent transition-colors"
              >
                Kodeks
              </Link>
              <Link
                href="/leaderboard"
                className="font-mono text-xs uppercase tracking-widest text-paper-dim hover:text-accent transition-colors"
              >
                Liderlik
              </Link>
              <NotificationToggle />
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="font-mono text-xs uppercase tracking-widest text-paper-dim hover:text-accent transition-colors">
                Giriş Yap
              </button>
            </SignInButton>
          )}
        </div>
      </header>

      <WarmupModal isOpen={warmupOpen} onClose={() => setWarmupOpen(false)} />
    </>
  );
}
