"use client";

import { useEffect, useState } from "react";
import {
  getCurrentSubscription,
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/pushClient";

export default function NotificationToggle() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPushSupported()) return;
    setSupported(true);
    getCurrentSubscription().then((sub) => setSubscribed(!!sub));
  }, []);

  async function toggle() {
    setBusy(true);
    try {
      if (subscribed) {
        await unsubscribeFromPush();
        setSubscribed(false);
      } else {
        const ok = await subscribeToPush();
        setSubscribed(ok);
      }
    } finally {
      setBusy(false);
    }
  }

  if (!supported) return null;

  return (
    <button
      onClick={toggle}
      disabled={busy}
      title={subscribed ? "Günlük hatırlatmayı kapat" : "Günlük hatırlatma bildirimi al"}
      className="font-mono text-xs uppercase tracking-widest text-paper-dim hover:text-accent transition-colors disabled:opacity-50"
    >
      {subscribed ? "🔔" : "🔕"}
    </button>
  );
}
