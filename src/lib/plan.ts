import { prisma } from "@/lib/prisma";

// Ödeme altyapısı yok (Faz 5.1) — şimdilik herkes ücretsiz katmanda,
// tek sınır günlük konu üretim sayısı. Stripe/Lemon Squeezy eklenince
// User.plan alanı gelip burada bypass edilecek.
export const DAILY_FREE_LIMIT = 5;

export async function getTodayUsage(userId: string): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return prisma.topicHistory.count({
    where: { userId, shownAt: { gte: startOfDay } },
  });
}
