import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";
import { getWeeklyChallenge } from "@/lib/weeklyChallenge";

// Canlı veriye bağlı (streak/oturum sayıları) — build anında değil, istek
// anında render edilmeli. Aksi halde deploy, build sırasındaki DB durumuna
// kilitlenir ve build DB'ye ulaşamazsa tüm deploy patlar.
export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      streakCount: true,
      _count: { select: { codexEntries: true } },
    },
  });

  const byStreak = [...users].sort((a, b) => b.streakCount - a.streakCount).slice(0, 10);
  const bySessions = [...users]
    .sort((a, b) => b._count.codexEntries - a._count.codexEntries)
    .slice(0, 10);

  return (
    <div className="flex-1 px-6 py-16 max-w-4xl mx-auto w-full">
      <span className="font-mono text-xs uppercase tracking-widest text-paper-dim">
        Liderlik Tablosu
      </span>
      <h1 className="font-display italic text-5xl mb-12">Kim Ne Kadar İleride?</h1>

      <div className="grid sm:grid-cols-2 gap-12">
        <Board
          title="En Uzun Seri"
          rows={byStreak.map((u, i) => ({
            rank: i + 1,
            id: u.id,
            name: u.name,
            value: `${u.streakCount} gün`,
          }))}
        />
        <Board
          title="En Çok Konu"
          rows={bySessions.map((u, i) => ({
            rank: i + 1,
            id: u.id,
            name: u.name,
            value: `${u._count.codexEntries}`,
          }))}
        />
      </div>

      <p className="mt-16 font-mono text-xs text-paper-dim">
        Haftanın meydan okuması:{" "}
        {CATEGORIES.find((c) => c.id === getWeeklyChallenge().category)?.label}
      </p>
    </div>
  );
}

interface Row {
  rank: number;
  id: string;
  name: string | null;
  value: string;
}

function Board({ title, rows }: { title: string; rows: Row[] }) {
  const nameCounts = new Map<string, number>();
  for (const r of rows) {
    const key = r.name ?? "";
    nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1);
  }

  return (
    <div>
      <h2 className="font-mono text-xs uppercase tracking-widest text-paper-dim mb-4">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-paper-dim text-sm">Henüz kimse yok.</p>
      ) : (
        <ol className="space-y-2">
          {rows.map((r) => {
            const isAmbiguous = !r.name || (nameCounts.get(r.name) ?? 0) > 1;
            return (
              <li
                key={r.rank}
                className="flex items-center justify-between border-b border-ink-line py-2"
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-accent w-5">{r.rank}</span>
                  <span>
                    {r.name ?? "Gezgin"}
                    {isAmbiguous && (
                      <span className="ml-1.5 font-mono text-[0.65rem] text-paper-dim">
                        #{r.id.slice(-4)}
                      </span>
                    )}
                  </span>
                </span>
                <span className="font-mono tabular-nums">{r.value}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
