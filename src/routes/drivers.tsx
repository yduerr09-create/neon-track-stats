import { createFileRoute, Link } from "@tanstack/react-router";
import { useLeague } from "@/lib/use-league";
import { driverStandings } from "@/lib/standings";
import { PageShell } from "@/components/page";

export const Route = createFileRoute("/drivers")({
  head: () => ({
    meta: [
      { title: "Fahrer-Gesamtwertung — ApexLeague" },
      {
        name: "description",
        content:
          "Komplette Fahrerwertung mit Punkten, Abstand zum Führenden, Interval, Elo und Safety Rating.",
      },
      { property: "og:title", content: "Fahrer-Gesamtwertung — ApexLeague" },
      {
        property: "og:description",
        content: "Punkte, Gaps, Elo und Safety Rating aller Fahrer der Saison.",
      },
    ],
  }),
  component: DriversPage,
});

function DriversPage() {
  const { data } = useLeague();
  const rows = driverStandings(data);

  return (
    <PageShell
      title="Fahrer-Gesamtwertung"
      subtitle="Saison 2026 · Punkte, Abstände, Skill- und Safety-Rating"
    >
      <div className="surface-card overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              <th className="px-4 py-3">Pos</th>
              <th className="px-4 py-3">Fahrer</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3 text-right">Punkte</th>
              <th className="px-4 py-3 text-right">Gap</th>
              <th className="px-4 py-3 text-right">Interval</th>
              <th className="px-4 py-3 text-right">Elo</th>
              <th className="px-4 py-3 text-right">SR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.driver.id}
                className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/60"
              >
                <td className="px-4 py-3 font-display text-primary">{row.pos}</td>
                <td className="px-4 py-3">
                  <Link
                    to="/driver/$id"
                    params={{ id: row.driver.id }}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {row.driver.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {row.team ? (
                    <Link
                      to="/team/$id"
                      params={{ id: row.team.id }}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {row.team.name}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-display text-foreground">{row.points}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {row.pos === 1 ? "—" : `-${row.gapToLeader}`}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {row.pos === 1 ? "—" : `-${row.interval}`}
                </td>
                <td className="px-4 py-3 text-right text-foreground">{row.driver.elo}</td>
                <td className="px-4 py-3 text-right">
                  <SrBadge value={row.driver.safety_rating} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}

export function SrBadge({ value }: { value: number }) {
  const tone =
    value >= 7 ? "bg-primary/15 text-primary" : value >= 4 ? "bg-secondary text-foreground" : "bg-destructive/15 text-destructive";
  return (
    <span className={`inline-block rounded px-2 py-1 font-display text-xs ${tone}`}>
      {Number(value ?? 0).toFixed(2)}
    </span>
  );
}
