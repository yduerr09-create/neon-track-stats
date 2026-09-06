import { createFileRoute, Link } from "@tanstack/react-router";
import { useLeague } from "@/lib/use-league";
import { teamStandings } from "@/lib/standings";
import { PageShell } from "@/components/page";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Team-Gesamtwertung — ApexLeague" },
      {
        name: "description",
        content: "Teamwertung mit Punkten, Abständen, Siegen und Podien der Saison 2026.",
      },
      { property: "og:title", content: "Team-Gesamtwertung — ApexLeague" },
      {
        property: "og:description",
        content: "Punkte, Abstände, Siege und Podien aller Teams.",
      },
    ],
  }),
  component: TeamsPage,
});

function TeamsPage() {
  const { data } = useLeague();
  const rows = teamStandings(data);

  return (
    <PageShell title="Team-Gesamtwertung" subtitle="Konstrukteurswertung der Saison 2026">
      <div className="surface-card overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              <th className="px-4 py-3">Pos</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3 text-right">Punkte</th>
              <th className="px-4 py-3 text-right">Gap</th>
              <th className="px-4 py-3 text-right">Interval</th>
              <th className="px-4 py-3 text-right">Siege</th>
              <th className="px-4 py-3 text-right">Podien</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.team.id}
                className="border-b border-border/50 last:border-0 hover:bg-secondary/60"
              >
                <td className="px-4 py-3 font-display text-primary">{row.pos}</td>
                <td className="px-4 py-3">
                  <Link
                    to="/team/$id"
                    params={{ id: row.team.id }}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {row.team.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {row.drivers.map((d) => d.name).join(" · ")}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-display text-foreground">{row.points}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {row.pos === 1 ? "—" : `-${row.gapToLeader}`}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {row.pos === 1 ? "—" : `-${row.interval}`}
                </td>
                <td className="px-4 py-3 text-right text-foreground">{row.wins}</td>
                <td className="px-4 py-3 text-right text-foreground">{row.podiums}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
