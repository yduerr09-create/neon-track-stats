import { createFileRoute, Link } from "@tanstack/react-router";
import { useLeague } from "@/lib/use-league";
import { driverStandings, teamStandings } from "@/lib/standings";
import { StatCard } from "@/components/page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ApexLeague — Simracing Liga Saison 2026" },
      {
        name: "description",
        content:
          "Live-Wertungen, Fahrerprofile, Teamstatistiken und der komplette 16-Rennen-Kalender der ApexLeague.",
      },
      { property: "og:title", content: "ApexLeague — Simracing Liga Saison 2026" },
      {
        property: "og:description",
        content: "Live-Wertungen, Fahrerprofile, Teamstatistiken und Rennkalender.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data } = useLeague();
  const drivers = driverStandings(data);
  const teams = teamStandings(data);
  const next = data.races.find(
    (r) => !data.results.some((res) => res.race_id === r.id),
  );

  return (
    <main>
      <section className="hero-gradient border-b border-border/70">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Saison 2026 · 16 Rennen</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl uppercase leading-tight text-foreground sm:text-6xl">
            Apex<span className="text-primary">League</span> Simracing
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Fahrer- und Teamwertung, Elo- und Safety-Rating, Renn­ergebnisse und Event-Infos an
            einem Ort.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/drivers"
              className="neon-glow rounded-md bg-primary px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground"
            >
              Fahrerwertung
            </Link>
            <Link
              to="/calendar"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-foreground hover:bg-secondary"
            >
              Rennkalender
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Fahrer" value={data.drivers.length} />
          <StatCard label="Teams" value={data.teams.length} />
          <StatCard
            label="Gefahrene Rennen"
            value={`${new Set(data.results.map((r) => r.race_id)).size} / ${data.races.length}`}
          />
          <StatCard label="Nächstes Event" value={next ? next.track : "Saisonende"} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="surface-card p-5">
            <h2 className="mb-4 font-display text-sm uppercase tracking-[0.2em] text-primary">
              Top 5 Fahrer
            </h2>
            <ul className="space-y-2">
              {drivers.slice(0, 5).map((row) => (
                <li key={row.driver.id}>
                  <Link
                    to="/driver/$id"
                    params={{ id: row.driver.id }}
                    className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-secondary"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 font-display text-primary">{row.pos}</span>
                      <span className="text-foreground">{row.driver.name}</span>
                      <span className="text-xs text-muted-foreground">{row.team?.name}</span>
                    </span>
                    <span className="font-display text-foreground">{row.points}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-card p-5">
            <h2 className="mb-4 font-display text-sm uppercase tracking-[0.2em] text-primary">
              Top 5 Teams
            </h2>
            <ul className="space-y-2">
              {teams.slice(0, 5).map((row) => (
                <li key={row.team.id}>
                  <Link
                    to="/team/$id"
                    params={{ id: row.team.id }}
                    className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-secondary"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 font-display text-primary">{row.pos}</span>
                      <span className="text-foreground">{row.team.name}</span>
                    </span>
                    <span className="font-display text-foreground">{row.points}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
