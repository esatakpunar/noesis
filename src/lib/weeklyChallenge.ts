import { CATEGORIES, type CategoryId } from "@/lib/categories";

function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

/** Haftaya göre deterministik dönen "öne çıkan kategori" — herkes için aynı hafta boyunca sabit. */
export function getWeeklyChallenge(now = new Date()): { category: CategoryId; week: number } {
  const week = isoWeekNumber(now);
  const category = CATEGORIES[week % CATEGORIES.length].id;
  return { category, week };
}
