import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

const CATEGORIES = [
  "diksiyon",
  "psikoloji",
  "felsefe",
  "bilim",
  "nadir",
  "etimoloji",
  "sanat",
] as const;

const DIFFICULTIES = ["kolay", "orta", "zor"] as const;

export const GeneratedTopicSchema = z.object({
  title: z.string().min(2).max(80),
  category: z.enum(CATEGORIES),
  difficulty: z.enum(DIFFICULTIES),
  pronunciation: z.string().nullable(),
  origin: z.string().nullable(),
  researchPrompts: z.array(z.string()).length(3),
});

export type GeneratedTopic = z.infer<typeof GeneratedTopicSchema>;

let _ai: GoogleGenAI | undefined;
function getAi(): GoogleGenAI {
  if (!_ai) _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return _ai;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    category: { type: Type.STRING, enum: [...CATEGORIES] },
    difficulty: { type: Type.STRING, enum: [...DIFFICULTIES] },
    pronunciation: { type: Type.STRING, nullable: true },
    origin: { type: Type.STRING, nullable: true },
    researchPrompts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      minItems: 3,
      maxItems: 3,
    },
  },
  required: ["title", "category", "difficulty", "researchPrompts"],
};

/**
 * Tek bir özgün konu üretir. `avoidTitles` daha önce kullanıcıya gösterilmiş
 * başlıkları taşır — tekrar üretimi engellemek için prompt'a gömülür.
 * Nihai tekilleştirme DB'de title'a bakan sorguyla yapılır (bkz. src/app/api/topics/generate).
 */
export async function generateTopic(params: {
  category?: (typeof CATEGORIES)[number];
  difficulty?: (typeof DIFFICULTIES)[number];
  avoidTitles: string[];
}): Promise<GeneratedTopic> {
  const { category, difficulty, avoidTitles } = params;

  const prompt = `
Sen noesis platformu için içerik üreten bir küratörsün. Amaç: kullanıcının
15 dakika araştırıp 2 dakikada anlatacağı, gerçekten ilgi çekici, nadir ama doğrulanabilir
bir kavram/kelime/fenomen üretmek.

Kategori: ${category ?? "kategorilerden birini sen seç: " + CATEGORIES.join(", ")}
Zorluk: ${difficulty ?? "kolay/orta/zor arasından uygun birini seç"}

Kurallar:
- Kavram gerçek olmalı, uydurma olmamalı.
- Türkçe konuş, başlık kısa ve çarpıcı olsun.
- Aşağıdaki listede olan başlıkları KESİNLİKLE tekrar üretme:
${avoidTitles.length ? avoidTitles.map((t) => `- ${t}`).join("\n") : "(liste boş)"}
- researchPrompts alanına kullanıcıyı 15 dakikalık araştırmaya yönlendirecek 3 açık uçlu soru yaz.
- pronunciation ve origin alanlarını sadece diksiyon/etimoloji kategorisinde anlamlıysa doldur, değilse null bırak.
`.trim();

  const result = await getAi().models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema,
      temperature: 1.1,
    },
  });

  const raw = JSON.parse(result.text ?? "{}");
  return GeneratedTopicSchema.parse(raw);
}
