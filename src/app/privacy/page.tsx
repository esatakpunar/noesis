export const metadata = { title: "Gizlilik Politikası — noesis" };

export default function PrivacyPage() {
  return (
    <div className="flex-1 px-6 py-16 max-w-2xl mx-auto w-full">
      <span className="font-mono text-xs uppercase tracking-widest text-paper-dim">
        Yasal
      </span>
      <h1 className="font-display italic text-4xl mb-10">Gizlilik Politikası</h1>

      <div className="space-y-8 text-paper-dim leading-relaxed text-sm">
        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper mb-2">
            Topladığımız Veri
          </h2>
          <p>
            Hesap oluştururken e-posta adresin ve (varsa) adın Clerk üzerinden alınır.
            Kullanım sırasında araştırdığın konular, yazdığın notlar, konuşma hızı
            (kelime/dakika), dolgu kelime sayısı ve netlik skorun kaydedilir.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper mb-2">
            Ne Kaydetmiyoruz
          </h2>
          <p>
            Sunum sırasında söylediklerinin ham ses kaydı veya tam metin dökümü
            sunucularımızda saklanmaz — yalnızca bu konuşmadan türetilen sayısal
            metrikler (hız, dolgu kelime, netlik) kaydedilir. Tarayıcın konuşmayı
            anlık olarak Web Speech API üzerinden (Chrome&apos;da Google&apos;ın
            servisleri aracılığıyla) yazıya döker; bu işlem noesis sunucularından
            bağımsız yürür.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper mb-2">
            Üçüncü Taraflar
          </h2>
          <p>
            Kimlik doğrulama için Clerk, veri depolama için Prisma Postgres, konu
            üretimi için Google Gemini API kullanılır. Bu sağlayıcılara yalnızca
            hizmeti çalıştırmak için gereken veriler iletilir. Verini satmıyoruz,
            reklam amaçlı paylaşmıyoruz.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper mb-2">
            Çerezler
          </h2>
          <p>
            Oturumunu açık tutmak için Clerk&apos;in oturum çerezleri kullanılır. Analitik
            veya reklam çerezi kullanmıyoruz.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper mb-2">
            Veri Silme
          </h2>
          <p>
            Hesabını sildiğinde tüm kişisel verilerin (notlar, geçmiş, istatistikler)
            kalıcı olarak silinir. Paylaşılan konu havuzuna eklediğin başlıklar (sana
            özgü kişisel veri içermediği için) kalabilir.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper mb-2">
            İletişim
          </h2>
          <p>Sorular için: esatakpunar@outlook.com</p>
        </section>
      </div>
    </div>
  );
}
