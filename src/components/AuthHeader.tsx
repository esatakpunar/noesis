"use client";

import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function AuthHeader() {
  const { isSignedIn } = useUser();

  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-ink-line">
      <Link href="/" className="font-mono text-xs tracking-[0.3em] uppercase text-paper-dim">
        noesis
      </Link>

      {isSignedIn ? (
        <div className="flex items-center gap-6">
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
          <UserButton />
        </div>
      ) : (
        <SignInButton mode="modal">
          <button className="font-mono text-xs uppercase tracking-widest text-paper-dim hover:text-accent transition-colors">
            Giriş Yap
          </button>
        </SignInButton>
      )}
    </header>
  );
}
