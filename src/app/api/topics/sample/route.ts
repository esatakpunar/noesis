import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Gemini isteği tipik olarak ~10sn sürüyor; reel 0.12sn/öğe hızında akıyor,
// yani döngünün tekrar etmeden en az bu kadar sürmesi için ~100 başlık gerekiyor.
const SAMPLE_SIZE = 120;

/**
 * Çark animasyonu için gerçek konu başlıklarından rastgele bir örnek döner.
 * Kimlik doğrulaması gerektirmez — süslemedir, kullanıcının kendi geçmişiyle
 * ilgisi yok. Havuz boşsa (ör. ilk deploy) boş dizi döner, TopicReel kendi
 * yedek kelimelerine düşer.
 */
export async function GET() {
  const titles = await prisma.$queryRaw<{ title: string }[]>`
    SELECT title FROM "Topic" ORDER BY RANDOM() LIMIT ${SAMPLE_SIZE}
  `;
  return NextResponse.json(titles.map((t) => t.title));
}
