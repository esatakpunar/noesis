import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateTopic } from "@/lib/gemini";
import { ensureDbUser } from "@/lib/auth";
import { isTooSimilar, pickCategory, pickDifficulty } from "@/lib/personalize";
import { DAILY_FREE_LIMIT, getTodayUsage } from "@/lib/plan";
import { pickFromPool } from "@/lib/pool";
import type { CategoryId } from "@/lib/categories";

const RequestSchema = z.object({
  category: z
    .enum(["diksiyon", "psikoloji", "felsefe", "bilim", "nadir", "etimoloji", "sanat"])
    .optional(),
  difficulty: z.enum(["kolay", "orta", "zor"]).optional(),
});

const MAX_ATTEMPTS = 3;

/** Gemini çağrısı yapılamadığında (limit, gerçek API hatası veya tekilleştirme
 * tükendiğinde) paylaşılan havuzdan görülmemiş bir konu döndürür. */
async function fallbackToPool(userId: string, category: CategoryId | undefined) {
  const pooled = await pickFromPool(userId, category);
  if (!pooled) return null;
  await prisma.topicHistory.create({ data: { userId, topicId: pooled.id } });
  return NextResponse.json({ ...pooled, fromPool: true });
}

export async function POST(req: NextRequest) {
  const user = await ensureDbUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = RequestSchema.parse(await req.json());

  const usedToday = await getTodayUsage(user.id);
  if (usedToday >= DAILY_FREE_LIMIT) {
    const pooled = await fallbackToPool(user.id, body.category);
    if (pooled) return pooled;
    return NextResponse.json(
      {
        error: "daily_limit_reached",
        message: `Günlük ücretsiz limitin (${DAILY_FREE_LIMIT} konu) doldu ve havuzda görmediğin başka konu kalmadı. Yarın devam edebilirsin.`,
      },
      { status: 429 },
    );
  }

  const [recentTitles, category, difficulty] = await Promise.all([
    prisma.topic.findMany({
      where: { history: { some: { userId: user.id } } },
      select: { title: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    body.category ? Promise.resolve(body.category) : pickCategory(user.id),
    body.difficulty ? Promise.resolve(body.difficulty) : pickDifficulty(user.id),
  ]);
  const avoidTitles = recentTitles.map((t: { title: string }) => t.title);

  try {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const generated = await generateTopic({ category, difficulty, avoidTitles });

      const clash = await prisma.topic.findFirst({
        where: { title: { equals: generated.title, mode: "insensitive" } },
      });
      if (clash || isTooSimilar(generated.title, avoidTitles)) {
        avoidTitles.push(generated.title);
        continue;
      }

      const topic = await prisma.topic.create({
        data: {
          title: generated.title,
          category: generated.category,
          difficulty: generated.difficulty,
          pronunciation: generated.pronunciation,
          origin: generated.origin,
          researchPrompts: generated.researchPrompts,
          source: "ai",
          history: { create: { userId: user.id } },
        },
      });

      return NextResponse.json(topic, { status: 201 });
    }
  } catch (err) {
    console.error("Gemini topic generation failed", err);
    const pooled = await fallbackToPool(user.id, body.category);
    if (pooled) return pooled;
    return NextResponse.json(
      {
        error: "generation_failed",
        message: "Konu üretim motorunda bir sorun oluştu. Birazdan tekrar dene.",
      },
      { status: 503 },
    );
  }

  const pooled = await fallbackToPool(user.id, body.category);
  if (pooled) return pooled;

  return NextResponse.json(
    { error: "Özgün konu üretilemedi, tekrar deneyin." },
    { status: 503 },
  );
}
