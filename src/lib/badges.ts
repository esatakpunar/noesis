export interface BadgeDef {
  id: string;
  label: string;
  description: string;
}

export const BADGES: BadgeDef[] = [
  { id: "ilk-adim", label: "İlk Adım", description: "İlk konunu tamamladın." },
  { id: "kivilcim", label: "Kıvılcım", description: "3 gün üst üste geldin." },
  { id: "alevlendi", label: "Alevlendi", description: "7 gün üst üste geldin." },
  { id: "yorulmaz", label: "Yorulmaz", description: "30 gün üst üste geldin." },
  { id: "cok-yonlu", label: "Çok Yönlü", description: "5 farklı kategoriden konu tamamladın." },
  {
    id: "duru-anlatici",
    label: "Duru Anlatıcı",
    description: "En az 5 oturumda ortalama netlik skorun 80+.",
  },
  { id: "derin-dalgic", label: "Derin Dalgıç", description: "20 konu tamamladın." },
];

export function computeBadges(stats: {
  totalSessions: number;
  streakCount: number;
  categoriesCovered: number;
  avgClarity: number | null;
}): BadgeDef[] {
  const unlocked = new Set<string>();

  if (stats.totalSessions >= 1) unlocked.add("ilk-adim");
  if (stats.streakCount >= 3) unlocked.add("kivilcim");
  if (stats.streakCount >= 7) unlocked.add("alevlendi");
  if (stats.streakCount >= 30) unlocked.add("yorulmaz");
  if (stats.categoriesCovered >= 5) unlocked.add("cok-yonlu");
  if (stats.totalSessions >= 5 && (stats.avgClarity ?? 0) >= 80) unlocked.add("duru-anlatici");
  if (stats.totalSessions >= 20) unlocked.add("derin-dalgic");

  return BADGES.filter((b) => unlocked.has(b.id));
}
