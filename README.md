# noesis

15 dakika araştır, 2 dakikada diksiyonla anlat — zihin ve hitabet geliştirme platformu.
Konu havuzu sabit değil: Gemini API ile talep üzerine özgün, tekrarsız konu üretilir.

Yol haritası ve mimari kararlar için `CLAUDE.md`.

## Kurulum

```bash
npm install
cp .env.example .env   # DATABASE_URL ve GEMINI_API_KEY doldur
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Yapı

- `src/app` — Next.js App Router sayfaları ve API route'ları
- `src/lib/gemini.ts` — dinamik konu üretim motoru
- `src/lib/prisma.ts` — DB client (driver adapter: `@prisma/adapter-pg`)
- `prisma/schema.prisma` — veri modeli
- `prisma/seed.ts` — çekirdek (soğuk başlangıç) konu seti

## Komutlar

```bash
npm run dev              # geliştirme sunucusu
npm run build             # prod build
npx prisma migrate dev    # şema değişikliğini uygula
npx prisma db seed        # çekirdek konuları yükle
npx prisma studio         # DB'yi görsel incele
```
