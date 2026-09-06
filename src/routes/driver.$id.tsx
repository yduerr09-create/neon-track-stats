import { createFileRoute, Link } from "@tanstack/react-router";
import { useLeague } from "@/lib/use-league";
import { driverSeason, driverStandings } from "@/lib/standings";
import { PageShell, StatCard } from "@/components/page";
import { SrBadge } from "./drivers";

export const Route = createFileRoute("/driver/$id")({
  head: () => ({
    meta: [
      { title: "Fahrerprofil — ApexLeague" },
      {
        name: "description",
        content: "Lifetime-Stats, Elo, Safety Rating und alle Rennergebnisse des Fahrers.",
      },
      { property: "og:title", content: "Fahrerprofil — ApexLeague" },
      {
        property: "og:description",
        content: "Lifetime-Stats, Performance-Rating und Saisonhistorie.",
      },
    ],
  }),
  component: DriverPage,
});

function DriverPage() {
  const { id } = Route.useParams();
  const { data } = useLeague();
  const standing = driverStandings(data).find((r) => r.driver.id === id);

  if (!standing) {
    return (
      <PageShell title="Fahrer nicht gefunden">
        <Link to="/drivers" className="text-primary">
          Zurück zur Fahrerwertung
        </Link>
      </PageShell>
    );
  }

  const { driver, team } = standing;
  const season = driverSeason(data, driver.id);

  return (
    <PageShell title={driver.name} subtitle={team ? team.name : "Ohne Team"}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Position" value={`P${standing.pos}`} />
        <StatCard label="Punkte Saison" value={standing.points} />
        <StatCard label="Elo / Skill Rating" value={driver.elo} />
        <StatCard label="Safety Rating" value={<SrBadge value={driver.safety_rating} />} />
      </div>

      <h2 className="mt-10 mb-3 font-display text-sm uppercase tracking-[0.2em] text-primary">
        Lifetime-Stats
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Gesamtpunkte (Lifetime)" value={driver.lifetime_points} />
        <StatCard label="Gefahrene Rennen" value={driver.career_races} />
        <StatCard label="Career Wins" value={driver.career_wins} />
        <StatCard label="Career Podien" value={driver.career_podiums} />
        <StatCard label="Top 5 (Saison)" value={standing.top5} />
        <StatCard label="Top 10 (Saison)" value={standing.top10} />
      </div>

      <h2 className="mt-10 mb-3 font-display text-sm uppercase tracking-[0.2em] text-primary">
        Saisonhistorie R1 – R{data.races.length}
      </h2>
      <div className="surface-card overflow-x-auto">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              <th className="px-4 py-3">Runde</th>
              <th className="px-4 py-3">Strecke</th>
              <th className="px-4 py-3 text-right">Startplatz</th>
              <th className="px-4 py-3 text-right">Position</th>
              <th className="px-4 py-3 text-right">Punkte</th>
              <th className="px-4 py-3 text-right">Vorfälle</th>
            </tr>
          </thead>
          <tbody>
            {season.map(({ race, result }) => (
              <tr key={race.id} className="border-b border-border/50 last:border-0">
                <td className="px-4 py-3 font-display text-muted-foreground">R{race.round}</td>
                <td className="px-4 py-3 text-foreground">{race.track}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {result ? `P${result.grid}` : "—"}
                </td>
                <td className="px-4 py-3 text-right font-display text-foreground">
                  {result ? `P${result.position}` : "—"}
                </td>
                <td className="px-4 py-3 text-right text-primary">{result ? result.points : "—"}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {result ? result.incidents : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
