@AGENTS.md

# noesis — Proje Kuralları

**noesis**, PARADOXA konseptinin (15 dk araştır, 2 dk diksiyonla anlat) sıfırdan,
gerçek ürün ölçeğinde yeniden inşasıdır. Bu repo başka bir projeden kod
kopyalanarak değil, aynı fikrin bağımsız implementasyonu olarak kuruldu —
seed veri, kod, prompt metinleri hep özgün.

## Tech stack

- **Next.js 16 (App Router)** + TypeScript + Tailwind v4, tek repo full-stack.
- **Postgres + Prisma** (`prisma/schema.prisma`) — kalıcı veri: users, topics,
  topic_history, codex_entries.
- **Gemini API** (`@google/genai`, `src/lib/gemini.ts`) — dinamik konu üretim
  motoru. Model: `gemini-flash-latest` (alias, otomatik güncel kalır — sabit
  versiyon deprecate olabiliyor, bkz. commit geçmişi), yapılandırılmış JSON
  çıktı (`responseSchema`).
- **Clerk** (`@clerk/nextjs` v7) — auth. `src/proxy.ts` (Next 16'da `middleware.ts`
  yerine `proxy.ts` kullanılıyor — deprecated uyarısı bunun için) tüm route'ları
  `/sign-in`, `/sign-up` hariç korur. `src/lib/auth.ts#ensureDbUser` Clerk
  oturumundaki kullanıcıyı `User` tablosunda garanti eder — `User.id` = Clerk
  user id, ayrı cuid üretilmiyor. v7'de `SignedIn`/`SignedOut` export'u yok,
  `useUser()` hook'u kullan (bkz. `src/components/AuthHeader.tsx`).
- Estetik yön: "gece scriptorium" — sıcak neredeyse-siyah zemin (`--ink`),
  parşömen metin (`--paper`), mühür-kırmızısı vurgu (`--accent`). Fontlar:
  Instrument Serif (başlık), Literata (gövde), IBM Plex Mono (sayaç/veri).
  Yeni ekran/komponent eklerken bu palete ve tipografi hiyerarşisine uy.

## Yol Haritası (fazlar)

- **Faz 0 — Scaffold** ✅ Next.js + Prisma + Gemini motoru temel iskeleti.
- **Faz 0.5 — Frontend** ✅ Discovery/Research/Presentation/Result akışı,
  özgün "gece scriptorium" tasarımı, Gemini API'ye bağlı çalışıyor.
- **Faz 1 — Backend temel** ✅ Clerk auth, `User`/`CodexEntry`/`TopicHistory`
  gerçek DB'de, `/api/codex` ve `/api/topics/generate` oturum bazlı çalışıyor,
  streak `/api/codex` içinde hesaplanıyor.
- **Faz 2 — Dinamik konu motoru** ✅ `src/lib/personalize.ts`: kategori seçimi
  kullanıcının tamamladığı konulara ağırlıklı (Laplace düzeltmeli) rastgele,
  %30 keşif oranıyla; zorluk netlik skoruna göre kademeli artıyor/azalıyor.
  `isTooSimilar` trigram-Jaccard ile yakın-tekrar başlıkları eliyor (ör.
  "Petrikor" ~ "Petrichor").
- **Faz 3 — Konuşma analizi**: Web Speech API yerine/yanında sunucu taraflı STT
  (Whisper API), tarayıcı bağımsız WPM/dolgu kelime/akıcılık skoru.
- **Faz 4 — Elde tutma & sosyal** ✅ `/leaderboard` (en uzun seri + en çok konu,
  server component, doğrudan Prisma), `/codex` (geçmiş + rozetler), rozet
  kataloğu `src/lib/badges.ts`, haftalık meydan okuma `src/lib/weeklyChallenge.ts`
  (ISO hafta numarasına göre deterministik kategori rotasyonu, DB'siz).
- **Faz 5 — Yayın**: Vercel deploy, domain. Freemium sınırı ✅ —
  `src/lib/plan.ts#DAILY_FREE_LIMIT` (5/gün), `/api/topics/generate` 429
  döner. Ödeme/plan yükseltme altyapısı yok, hepsi şu an ücretsiz katmanda.
  Deploy adımı henüz yapılmadı (git push + Vercel bağlantısı gerekiyor,
  hesap işlemleri kullanıcı tarafından yapılmalı).

Faz 3 (sunucu taraflı STT) ertelendi — OpenAI key gelince ele alınacak.
Şu an Faz 0, 0.5, 1, 2 ve 4 tamamlandı, Faz 5 kısmen (freemium) tamam,
deploy adımı bekliyor.

## Bilinen sınırlar

- `/leaderboard` tüm kullanıcıları çekip JS'te sıralıyor — kullanıcı sayısı
  büyüdüğünde (binlerce+) SQL tarafında `ORDER BY` + `LIMIT`'e geçirilmeli.

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
