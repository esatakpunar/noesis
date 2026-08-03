import { prisma } from "@/lib/prisma";

// Ödeme altyapısı yok (Faz 5.1) — şimdilik herkes ücretsiz katmanda,
// tek sınır günlük konu üretim sayısı. Stripe/Lemon Squeezy eklenince
// User.plan alanı gelip burada bypass edilecek.
export const DAILY_FREE_LIMIT = 5;

// Hesap sayısından bağımsız güvenlik ağı: kaç kullanıcı/sahte hesap olursa
// olsun, günlük toplam Gemini üretimi bu sayıyı geçince sistem otomatik
// havuza düşer (bkz. /api/topics/generate). Tek başına sahte hesap açmayı
// engellemez ama bütçeyi sınırsız büyümeden korur.
export const GLOBAL_DAILY_AI_LIMIT = 300;

export async function getTodayUsage(userId: string): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return prisma.topicHistory.count({
    where: { userId, shownAt: { gte: startOfDay } },
  });
}

export async function getTodayGlobalAiUsage(): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return prisma.topic.count({
    where: { source: "ai", createdAt: { gte: startOfDay } },
  });
}
