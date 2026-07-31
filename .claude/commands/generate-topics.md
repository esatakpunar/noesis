---
description: Gemini konu üretim motorunu çalıştırıp DB'ye N yeni konu ekle
---

`src/lib/gemini.ts` içindeki `generateTopic` fonksiyonunu kullanarak $ARGUMENTS
(sayı, default 5) adet yeni konu üret ve `/api/topics/generate` akışıyla aynı
tekilleştirme mantığını izleyerek DB'ye kaydet. Kategori dağılımını
`TOPIC_CATEGORIES` arasında dengeli tut. İşlem bitince kaç konu eklendiğini,
hangi kategorilerden olduğunu özetle.

Not: GEMINI_API_KEY `.env` içinde tanımlı değilse çalıştırmadan önce kullanıcıyı uyar.
