import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureDbUser } from "@/lib/auth";

const BodySchema = z.object({
  topicId: z.string(),
  notes: z.string().optional(),
  wpm: z.number().int().optional(),
  fillerWordCount: z.number().int().optional(),
  clarityScore: z.number().optional(),
});

export async function GET() {
  const user = await ensureDbUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await prisma.codexEntry.findMany({
    where: { userId: user.id },
    include: { topic: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const user = await ensureDbUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = BodySchema.parse(await req.json());

  const entry = await prisma.codexEntry.create({
    data: { ...body, userId: user.id },
  });

  const today = new Date().toISOString().split("T")[0];
  const lastDate = user.streakLastDate?.toISOString().split("T")[0] ?? null;

  let streakCount = user.streakCount;
  if (lastDate !== today) {
    const diffDays = lastDate
      ? Math.round((new Date(today).getTime() - new Date(lastDate).getTime()) / 86_400_000)
      : null;
    streakCount = diffDays === 1 ? streakCount + 1 : 1;
    await prisma.user.update({
      where: { id: user.id },
      data: { streakCount, streakLastDate: new Date(today) },
    });
  }

  return NextResponse.json({ entry, streakCount }, { status: 201 });
}
