export const metadata = { title: "Kullanım Koşulları — noesis" };

export default function TermsPage() {
  return (
    <div className="flex-1 px-6 py-16 max-w-2xl mx-auto w-full">
      <span className="font-mono text-xs uppercase tracking-widest text-paper-dim">
        Yasal
      </span>
      <h1 className="font-display italic text-4xl mb-10">Kullanım Koşulları</h1>

      <div className="space-y-8 text-paper-dim leading-relaxed text-sm">
        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper mb-2">
            Hizmet
          </h2>
          <p>
            noesis, günlük bir araştırma ve diksiyon pratiği platformudur. Kullanıcılara
            15 dakikalık araştırma ve 2 dakikalık sözlü anlatım döngüsü sunar. Hizmet
            &quot;olduğu gibi&quot; sağlanır, kesintisiz veya hatasız çalışacağı garanti
            edilmez.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper mb-2">
            Hesap
          </h2>
          <p>
            Hizmeti kullanmak için Clerk üzerinden bir hesap oluşturman gerekir.
            Hesabının güvenliğinden sen sorumlusun. Hesabını istediğin zaman
            silebilirsin; bu, ilişkili tüm verilerinin kalıcı olarak silinmesi anlamına
            gelir.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper mb-2">
            Yapay Zeka İçeriği
          </h2>
          <p>
            Konular ve araştırma soruları Google Gemini API ile üretilir. Üretilen
            içerik bazen yanlış, eksik veya beklenmedik olabilir — araştırma sırasında
            doğruluğunu kendi kaynaklarınla teyit etmen önerilir.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper mb-2">
            İçerik ve Kullanım
          </h2>
          <p>
            Notların sana aittir. Hizmeti kötüye kullanmamayı (otomatik istek
            göndermek, günlük limitleri aşmak için sahte hesap açmak, başkalarının
            hesaplarına erişmeye çalışmak) kabul edersin.
          </p>
        </section>

        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-paper mb-2">
            Değişiklikler
          </h2>
          <p>
            Bu koşullar zaman zaman güncellenebilir. Önemli değişikliklerde makul
            ölçüde bilgilendirme yapılır.
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
