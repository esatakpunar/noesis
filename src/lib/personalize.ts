import { prisma } from "@/lib/prisma";

const ALL_CATEGORIES = [
  "diksiyon",
  "psikoloji",
  "felsefe",
  "bilim",
  "nadir",
  "etimoloji",
  "sanat",
] as const;
type Category = (typeof ALL_CATEGORIES)[number];

const DIFFICULTY_ORDER = ["kolay", "orta", "zor"] as const;
type Difficulty = (typeof DIFFICULTY_ORDER)[number];

const EXPLORATION_RATE = 0.3;

/**
 * Kullanıcının tamamladığı konuların kategori dağılımına göre ağırlıklı
 * rastgele seçim yapar. %30 ihtimalle tamamen keşfe (rastgele kategori)
 * bırakır ki zevkine saplanıp çeşitlilik kaybolmasın.
 */
export async function pickCategory(userId: string): Promise<Category | undefined> {
  if (Math.random() < EXPLORATION_RATE) return undefined;

  const entries = await prisma.codexEntry.findMany({
    where: { userId },
    select: { topic: { select: { category: true } } },
    take: 100,
    orderBy: { createdAt: "desc" },
  });
  if (entries.length === 0) return undefined;

  // Laplace düzeltmesi: hiç denenmemiş kategoriler de sıfır olmasın.
  const counts = new Map<Category, number>(ALL_CATEGORIES.map((c) => [c, 1]));
  for (const e of entries) {
    const c = e.topic.category as Category;
    counts.set(c, (counts.get(c) ?? 1) + 1);
  }

  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (const [category, weight] of counts) {
    roll -= weight;
    if (roll <= 0) return category;
  }
  return undefined;
}

/**
 * Son oturumların netlik skoruna bakarak zorluk seviyesini kademeli
 * artırır/azaltır. Yeni kullanıcı 'kolay'dan başlar.
 */
export async function pickDifficulty(userId: string): Promise<Difficulty | undefined> {
  const recent = await prisma.codexEntry.findMany({
    where: { userId, clarityScore: { not: null } },
    select: { clarityScore: true, topic: { select: { difficulty: true } } },
    take: 5,
    orderBy: { createdAt: "desc" },
  });
  if (recent.length === 0) return "kolay";

  const avgClarity =
    recent.reduce((sum, e) => sum + (e.clarityScore ?? 0), 0) / recent.length;
  const currentTier = recent[0].topic.difficulty as Difficulty;
  const idx = DIFFICULTY_ORDER.indexOf(currentTier);

  if (avgClarity >= 75 && idx < DIFFICULTY_ORDER.length - 1) {
    return DIFFICULTY_ORDER[idx + 1];
  }
  if (avgClarity < 50 && idx > 0) {
    return DIFFICULTY_ORDER[idx - 1];
  }
  return currentTier;
}

/** Tam eşleşme dışında da örtüşen başlıkları eler (ör. "Petrikor" ~ "Petrichor"). */
export function isTooSimilar(title: string, existing: string[]): boolean {
  const trigrams = (s: string) => {
    const clean = s.toLowerCase().normalize("NFKD").replace(/[^a-zçğıöşü]/g, "");
    const grams = new Set<string>();
    for (let i = 0; i < clean.length - 2; i++) grams.add(clean.slice(i, i + 3));
    return grams;
  };
  const a = trigrams(title);
  if (a.size === 0) return false;

  for (const other of existing) {
    const b = trigrams(other);
    if (b.size === 0) continue;
    const intersection = [...a].filter((g) => b.has(g)).length;
    const union = new Set([...a, ...b]).size;
    if (union > 0 && intersection / union > 0.6) return true;
  }
  return false;
}
