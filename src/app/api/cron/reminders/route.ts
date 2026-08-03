import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPush } from "@/lib/push";

// Vercel Cron, proje ayarlarında CRON_SECRET tanımlıysa isteğe otomatik
// `Authorization: Bearer <CRON_SECRET>` ekler — bkz. vercel.json.
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const candidates = await prisma.user.findMany({
    where: {
      pushSubscriptions: { some: {} },
      codexEntries: { none: { createdAt: { gte: startOfDay } } },
    },
    select: {
      id: true,
      name: true,
      streakCount: true,
      pushSubscriptions: true,
    },
  });

  let sent = 0;
  let expiredRemoved = 0;

  for (const user of candidates) {
    const streakAtRisk = user.streakCount > 0;
    const payload = streakAtRisk
      ? {
          title: `${user.streakCount} günlük serin risk altında 🔥`,
          body: "Bugün henüz bir konu araştırmadın — serini kırma.",
          url: "/",
        }
      : {
          title: "Bugün ne kavrayacaksın?",
          body: "15 dakika araştır, 2 dakikada anlat.",
          url: "/",
        };

    for (const sub of user.pushSubscriptions) {
      const result = await sendPush(sub, payload);
      if (result.ok) sent++;
      if (result.expired) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } });
        expiredRemoved++;
      }
    }
  }

  return NextResponse.json({ candidates: candidates.length, sent, expiredRemoved });
}
