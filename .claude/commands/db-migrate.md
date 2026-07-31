---
description: Prisma şema değişikliğini planla, migration oluştur ve uygula
---

`prisma/schema.prisma` üzerinde $ARGUMENTS açıklamasına göre değişiklik yap.
Adımlar:

1. Şemayı düzenle.
2. `npx prisma migrate dev --name <kısa-isim>` çalıştır.
3. Yeni alan/model kullanan yerlerde (`src/lib`, `src/app/api`) tip hatası
   kalmadığından emin ol.
4. Değişikliği CLAUDE.md'deki ilgili fazla çelişmiyorsa özetle, çelişiyorsa
   kullanıcıya sor.
