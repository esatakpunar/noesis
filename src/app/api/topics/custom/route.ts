import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureDbUser } from "@/lib/auth";

const RequestSchema = z.object({
  title: z.string().trim().min(2).max(80),
  category: z
    .enum(["diksiyon", "psikoloji", "felsefe", "bilim", "nadir", "etimoloji", "sanat"])
    .optional(),
});

// Gemini'ye gitmiyoruz — başlığa göre genel geçer ama konuya özelmiş hissi
// veren şablon sorular üretiyoruz. Ücretsiz, günlük limiti tüketmez.
function genericPrompts(title: string): string[] {
  return [
    `${title} kavramının kökeni ve temel tanımı nedir?`,
    `${title} günlük hayatta veya popüler kültürde nasıl karşımıza çıkar?`,
    `${title} hakkında çoğu insanın bilmediği şaşırtıcı bir detay var mı?`,
  ];
}

export async function POST(req: NextRequest) {
  const user = await ensureDbUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = RequestSchema.parse(await req.json());

  const existing = await prisma.topic.findFirst({
    where: { title: { equals: body.title, mode: "insensitive" } },
  });

  const topic =
    existing ??
    (await prisma.topic.create({
      data: {
        title: body.title,
        category: body.category ?? "nadir",
        difficulty: "orta",
        pronunciation: null,
        origin: null,
        researchPrompts: genericPrompts(body.title),
        source: "user",
      },
    }));

  await prisma.topicHistory.create({ data: { userId: user.id, topicId: topic.id } });

  return NextResponse.json(topic, { status: 201 });
}
