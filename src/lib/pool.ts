import { prisma } from "@/lib/prisma";
import type { CategoryId } from "@/lib/categories";

/**
 * Günlük Gemini limiti dolduğunda kullanıcıya tamamen "hayır" demek yerine
 * paylaşılan havuzdan (herkesin ürettiği + seed) bu kullanıcının henüz
 * görmediği bir konu sunar. Maliyetsiz — Gemini çağrısı yok.
 */
export async function pickFromPool(userId: string, category?: CategoryId) {
  const where = {
    ...(category ? { category } : {}),
    history: { none: { userId } },
  };

  const count = await prisma.topic.count({ where });
  if (count === 0) return null;

  const skip = Math.floor(Math.random() * count);
  return prisma.topic.findFirst({ where, skip, orderBy: { createdAt: "asc" } });
}
