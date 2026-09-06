import { createFileRoute, Link } from "@tanstack/react-router";
import { useLeague } from "@/lib/use-league";
import { teamStandings } from "@/lib/standings";
import { PageShell, StatCard } from "@/components/page";

export const Route = createFileRoute("/team/$id")({
  head: () => ({
    meta: [
      { title: "Teamprofil — ApexLeague" },
      {
        name: "description",
        content: "Fahrerkader, Gesamtpunkte und Rennergebnisse pro Rennwochenende.",
      },
      { property: "og:title", content: "Teamprofil — ApexLeague" },
      {
        property: "og:description",
        content: "Kader, Punkte und Ergebnisse des Teams.",
      },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const { id } = Route.useParams();
  const { data } = useLeague();
  const standing = teamStandings(data).find((r) => r.team.id === id);

  if (!standing) {
    return (
      <PageShell title="Team nicht gefunden">
        <Link to="/teams" className="text-primary">
          Zurück zur Teamwertung
        </Link>
      </PageShell>
    );
  }

  const driverIds = new Set(standing.drivers.map((d) => d.id));

  return (
    <PageShell title={standing.team.name} subtitle={`Position ${standing.pos} · Saison 2026`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Position" value={`P${standing.pos}`} />
        <StatCard label="Gesamtpunkte" value={standing.points} />
        <StatCard label="Siege" value={standing.wins} />
        <StatCard label="Podien" value={standing.podiums} />
      </div>

      <h2 className="mt-10 mb-3 font-display text-sm uppercase tracking-[0.2em] text-primary">
        Fahrerkader
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {standing.drivers.map((d) => (
          <Link
            key={d.id}
            to="/driver/$id"
            params={{ id: d.id }}
            className="surface-card p-4 transition-colors hover:border-primary"
          >
            <div className="font-display text-lg text-foreground">{d.name}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
              Elo {d.elo} · SR {Number(d.safety_rating ?? 0).toFixed(2)}
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 mb-3 font-display text-sm uppercase tracking-[0.2em] text-primary">
        Ergebnisse pro Rennwochenende
      </h2>
      <div className="space-y-3">
        {data.races.map((race) => {
          const res = data.results
            .filter((r) => r.race_id === race.id && driverIds.has(r.driver_id))
            .sort((a, b) => a.position - b.position);
          const pts = res.reduce((a, b) => a + b.points, 0);
          return (
            <div key={race.id} className="surface-card p-4">
              <div className="flex items-center justify-between">
                <div className="font-display uppercase tracking-wide text-foreground">
                  R{race.round} · {race.track}
                </div>
                <div className="font-display text-primary">{pts} P</div>
              </div>
              {res.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {res.map((r) => {
                    const drv = data.drivers.find((d) => d.id === r.driver_id);
                    return (
                      <span
                        key={r.id}
                        className="rounded bg-secondary px-2 py-1 text-xs text-foreground"
                      >
                        P{r.position} — {drv?.name} ({r.points} P)
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-2 text-xs text-muted-foreground">Noch nicht gefahren</div>
              )}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
