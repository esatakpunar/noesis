import { NextResponse } from "next/server";
import { ensureDbUser } from "@/lib/auth";
import { DAILY_FREE_LIMIT, getTodayUsage } from "@/lib/plan";

export async function GET() {
  const user = await ensureDbUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const used = await getTodayUsage(user.id);
  return NextResponse.json({ used, limit: DAILY_FREE_LIMIT, remaining: Math.max(0, DAILY_FREE_LIMIT - used) });
}
