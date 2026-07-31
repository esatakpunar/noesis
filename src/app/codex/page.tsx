import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeBadges } from "@/lib/badges";

export default async function CodexPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [user, entries] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.codexEntry.findMany({
      where: { userId },
      include: { topic: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const categoriesCovered = new Set(entries.map((e) => e.topic.category)).size;
  const clarityScores = entries.map((e) => e.clarityScore).filter((v): v is number => v != null);
  const avgClarity =
    clarityScores.length > 0
      ? clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length
      : null;

  const badges = computeBadges({
    totalSessions: entries.length,
    streakCount: user?.streakCount ?? 0,
    categoriesCovered,
    avgClarity,
  });

  return (
    <div className="flex-1 px-6 py-16 max-w-4xl mx-auto w-full">
      <span className="font-mono text-xs uppercase tracking-widest text-paper-dim">Kodeks</span>
      <h1 className="font-display italic text-5xl mb-10">Zihin Arşivin</h1>

      <div className="mb-14">
        <h2 className="font-mono text-xs uppercase tracking-widest text-paper-dim mb-4">
          Rozetler ({badges.length})
        </h2>
        {badges.length === 0 ? (
          <p className="text-paper-dim text-sm">Henüz rozet kazanmadın — ilk konunu tamamla.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                title={b.description}
                className="px-4 py-2 border border-accent/40 bg-accent-soft font-mono text-xs uppercase tracking-wide"
              >
                {b.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <h2 className="font-mono text-xs uppercase tracking-widest text-paper-dim mb-4">
        Geçmiş ({entries.length})
      </h2>
      {entries.length === 0 ? (
        <p className="text-paper-dim text-sm">Henüz kayıt yok.</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((e) => (
            <li key={e.id} className="border-b border-ink-line pb-4">
              <div className="flex items-baseline justify-between">
                <span className="font-display italic text-2xl">{e.topic.title}</span>
                <span className="font-mono text-xs text-paper-dim">
                  {new Date(e.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
              {e.notes && <p className="text-paper-dim text-sm mt-1 line-clamp-2">{e.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
