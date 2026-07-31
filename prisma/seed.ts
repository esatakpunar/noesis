import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Küçük, özgün çekirdek veri seti — kalan hacim src/lib/gemini.ts ile üretilir.
const SEED_TOPICS = [
  {
    title: "Baader-Meinhof Fenomeni",
    category: "psikoloji" as const,
    difficulty: "orta" as const,
    pronunciation: null,
    origin: "Frekans yanılsaması / seçici dikkat",
    researchPrompts: [
      "Bir kelimeyi öğrendikten sonra her yerde karşımıza çıkması neden oluyor?",
      "Bu fenomen doğrulama yanlılığıyla nasıl ilişkili?",
      "Günlük hayatta bu etkiden nasıl fark edilmeden etkileniyoruz?",
    ],
  },
  {
    title: "Sorites Paradoksu",
    category: "felsefe" as const,
    difficulty: "zor" as const,
    pronunciation: "so-ri-tes",
    origin: "Antik Yunan (soros: yığın)",
    researchPrompts: [
      "Bir kum yığınından tek tek tane çıkarınca ne zaman 'yığın' olmaktan çıkar?",
      "Bulanık kümeler (fuzzy sets) bu paradoksu nasıl çözmeye çalışır?",
      "Sorites paradoksunun hukuk ve dil felsefesindeki yansımaları nelerdir?",
    ],
  },
  {
    title: "Petrichor",
    category: "bilim" as const,
    difficulty: "kolay" as const,
    pronunciation: "pet-ri-kor",
    origin: "Yunanca (petra: taş + ichor: tanrı kanı)",
    researchPrompts: [
      "Yağmur sonrası o karakteristik koku kimyasal olarak nasıl oluşur?",
      "Geosmin bileşiği burada nasıl rol oynuyor?",
      "İnsanlar bu kokuya neden bu kadar güçlü duygusal tepki veriyor?",
    ],
  },
  {
    title: "Tsundoku",
    category: "nadir" as const,
    difficulty: "kolay" as const,
    pronunciation: "tsun-do-ku",
    origin: "Japonca",
    researchPrompts: [
      "Satın alınıp okunmayan kitap biriktirme alışkanlığının psikolojik kökeni ne?",
      "Bu kavramın dijital çağdaki karşılığı ne olabilir?",
      "Farklı kültürlerde benzer 'biriktirme' kavramları var mı?",
    ],
  },
  {
    title: "Sprezzatura",
    category: "sanat" as const,
    difficulty: "orta" as const,
    pronunciation: "spret-tsa-tu-ra",
    origin: "İtalyanca (Castiglione, 16. yy)",
    researchPrompts: [
      "Zahmetsiz görünen ama aslında büyük emek isteyen zarafet nasıl tanımlanır?",
      "Bu kavram modern sanat ve modada nasıl karşılık buluyor?",
      "Sprezzatura ile 'çaba gösterme' arasındaki paradoks nedir?",
    ],
  },
] satisfies Array<{
  title: string;
  category: "psikoloji" | "felsefe" | "bilim" | "nadir" | "sanat";
  difficulty: "kolay" | "orta" | "zor";
  pronunciation: string | null;
  origin: string;
  researchPrompts: string[];
}>;

async function main() {
  for (const topic of SEED_TOPICS) {
    await prisma.topic.upsert({
      where: { title: topic.title },
      update: {},
      create: { ...topic, source: "seed" },
    });
  }
  console.log(`Seeded ${SEED_TOPICS.length} topics.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
