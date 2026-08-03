@AGENTS.md

# noesis — Proje Kuralları

**noesis**, sosyal medyanın yarattığı zihinsel uyuşukluğa karşı günlük bir
alışkanlık: her gün nadir/hiç duyulmamış bir kavram sunulur, 15 dakika
araştırılır, 2 dakikada diksiyonla anlatılır.

## Tech stack

- **Next.js 16 (App Router)** + TypeScript + Tailwind v4, tek repo full-stack.
- **Postgres + Prisma** (`prisma/schema.prisma`) — kalıcı veri: users, topics,
  topic_history, codex_entries.
- **Gemini API** (`@google/genai`, `src/lib/gemini.ts`) — dinamik konu üretim
  motoru. Model: `gemini-flash-latest` (alias, otomatik güncel kalır — sabit
  versiyon deprecate olabiliyor, bkz. commit geçmişi), yapılandırılmış JSON
  çıktı (`responseSchema`).
- **Clerk** (`@clerk/nextjs` v7) — auth. `src/proxy.ts` (Next 16'da `middleware.ts`
  yerine `proxy.ts` kullanılıyor — deprecated uyarısı bunun için) route'ları
  korur; `/`, `/terms`, `/privacy`, `/sign-in`, `/sign-up` herkese açık.
  `src/lib/auth.ts#ensureDbUser` Clerk oturumundaki kullanıcıyı `User`
  tablosunda garanti eder — `User.id` = Clerk user id, ayrı cuid üretilmiyor.
  v7'de `SignedIn`/`SignedOut` export'u yok, `useUser()` hook'u kullan (bkz.
  `src/components/AuthHeader.tsx`). **Hâlâ development instance'ta çalışıyor**
  — production'a geçiş bekliyor (bkz. Bilinen sınırlar).
- Estetik yön: "gece scriptorium" — sıcak neredeyse-siyah zemin (`--ink`),
  parşömen metin (`--paper`), mühür-kırmızısı vurgu (`--accent`). Fontlar:
  Instrument Serif (başlık), Literata (gövde), IBM Plex Mono (sayaç/veri).
  Yeni ekran/komponent eklerken bu palete ve tipografi hiyerarşisine uy.

## Mevcut özellikler

- **Discovery/Research/Presentation/Result akışı** (`src/components/AppFlow.tsx`)
  — 15 dk araştırma + 2 dk diksiyon sunumu, Web Speech API ile canlı analiz.
- **Landing sayfası** (`src/components/LandingPage.tsx`) — girişsiz ziyaretçiye
  gösterilir, `src/app/page.tsx` `useUser()` ile dallanır.
- **Kişiselleştirme** (`src/lib/personalize.ts`) — kategori ağırlıklı rastgele
  (%30 keşif oranı), zorluk netlik skoruna göre kademeli.
- **Paylaşılan havuz fallback** (`src/lib/pool.ts`) — günlük limit dolunca veya
  Gemini gerçekten hata verince, kullanıcının görmediği bir havuz konusu
  sunulur (Gemini maliyeti yok).
- **Kendi konunu gir** (`/api/topics/custom`) — Gemini'ye gitmeden, şablon
  araştırma sorularıyla anında başlar, günlük limiti tüketmez.
- **Isınma egzersizi** (`src/components/WarmupModal.tsx`) — header'dan her an
  açılabilir, hiçbir sayacı etkilemez.
- **Paylaşım kartı** (`src/components/ShareCard.tsx`, `ShareModal.tsx`) —
  sonuç ekranından 1080×1080 PNG indirme (`html-to-image`).
- **Freemium** (`src/lib/plan.ts`) — günlük 5 ücretsiz konu, aşınca önce havuz
  denenir, o da tükenirse 429.
- **Liderlik/Kodeks/rozet/haftalık meydan okuma** — `/leaderboard`, `/codex`,
  `src/lib/badges.ts`, `src/lib/weeklyChallenge.ts`.

## Bilinen sınırlar / açık işler

- **Clerk hâlâ development instance'ta** — production key setine geçilmedi,
  gerçek trafikte limitlere takılır. Bu adım kullanıcı tarafından Clerk
  dashboard'dan yapılmalı (yeni proje/domain bağlama gerektiriyor).
- **Custom domain yok** — `noesis-seven-wheat.vercel.app` üzerinde çalışıyor.
  `src/app/layout.tsx#siteUrl` ve `src/app/sitemap.ts`/`robots.ts` içindeki
  sabit URL'ler custom domain bağlanınca güncellenmeli.
- **Sunucu taraflı STT yok** — Web Speech API tarayıcı bağımlı (Chromium),
  OpenAI key gelince Whisper'a geçirilebilir.
- `/leaderboard` tüm kullanıcıları çekip JS'te sıralıyor — kullanıcı sayısı
  büyüdüğünde (binlerce+) SQL tarafında `ORDER BY` + `LIMIT`'e geçirilmeli.
- **Analytics yok** — trafik/dönüşüm görünürlüğü henüz eklenmedi, bilinçli
  olarak sona bırakıldı.

## Konvansiyonlar

- Dil: UI metni ve içerik **Türkçe**. Kod, commit mesajı, yorum İngilizce.
- Konu üretiminde `avoidTitles` listesi her zaman DB'deki mevcut başlıklarla
  doldurulmalı — tekrarı Gemini prompt seviyesinde önle, DB'de `title` unique
  index ile garanti altına al (bkz. `prisma/schema.prisma`).
- Yeni Prisma modeli/alanı eklerken migration oluştur: `npx prisma migrate dev --name <isim>`.
- Seed verisi (`prisma/seed.ts`) küçük ve özgün tutulur — hacim AI üretimiyle gelir,
  seed sadece soğuk başlangıç (cold start) içindir.
- Next.js 16 bu repo'da agent training datasındaki API'lerden farklı olabilir —
  kod yazmadan önce `AGENTS.md` talimatına uy, gerekirse `node_modules/next/dist/docs/`
  içine bak.

## Sık kullanılan komutlar

- `npm run dev` — geliştirme sunucusu
- `npx prisma migrate dev` — şema değişikliğini uygula
- `npx prisma db seed` — çekirdek konuları yükle
- `npx prisma studio` — DB'yi görsel incele
- `npx vercel deploy --prod --yes` — production deploy
