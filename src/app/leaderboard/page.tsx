import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";
import { getWeeklyChallenge } from "@/lib/weeklyChallenge";

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
        <Board title="En Uzun Seri" rows={byStreak.map((u, i) => ({
          rank: i + 1,
          name: displayName(u.name, u.id),
          value: `${u.streakCount} gün`,
        }))} />
        <Board title="En Çok Konu" rows={bySessions.map((u, i) => ({
          rank: i + 1,
          name: displayName(u.name, u.id),
          value: `${u._count.codexEntries}`,
        }))} />
      </div>

      <p className="mt-16 font-mono text-xs text-paper-dim">
        Haftanın meydan okuması:{" "}
        {CATEGORIES.find((c) => c.id === getWeeklyChallenge().category)?.label}
      </p>
    </div>
  );
}

function displayName(name: string | null, id: string) {
  return name ?? `Gezgin #${id.slice(-4)}`;
}

function Board({ title, rows }: { title: string; rows: { rank: number; name: string; value: string }[] }) {
  return (
    <div>
      <h2 className="font-mono text-xs uppercase tracking-widest text-paper-dim mb-4">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-paper-dim text-sm">Henüz kimse yok.</p>
      ) : (
        <ol className="space-y-2">
          {rows.map((r) => (
            <li key={r.rank} className="flex items-center justify-between border-b border-ink-line py-2">
              <span className="flex items-center gap-3">
                <span className="font-mono text-accent w-5">{r.rank}</span>
                <span>{r.name}</span>
              </span>
              <span className="font-mono tabular-nums">{r.value}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
