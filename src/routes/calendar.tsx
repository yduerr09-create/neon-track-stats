import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, CloudRain, Thermometer, Timer } from "lucide-react";
import { useLeague } from "@/lib/use-league";
import { PageShell } from "@/components/page";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Rennkalender & Events — ApexLeague" },
      {
        name: "description",
        content:
          "Alle 16 Rennwochenenden mit Strecke, Datum, Zeitplan und Conditions wie Temperatur und Regenwahrscheinlichkeit.",
      },
      { property: "og:title", content: "Rennkalender & Events — ApexLeague" },
      {
        property: "og:description",
        content: "16 Rennwochenenden mit Zeitplan und Wetterbedingungen.",
      },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const { data } = useLeague();

  return (
    <PageShell title="Rennkalender" subtitle={`${data.races.length} Rennwochenenden · Saison 2026`}>
      <div className="grid gap-4 md:grid-cols-2">
        {data.races.map((race) => {
          const done = data.results.some((r) => r.race_id === race.id);
          return (
            <article key={race.id} className="surface-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-primary">
                    Runde {race.round}
                  </div>
                  <h2 className="mt-1 font-display text-xl text-foreground">{race.track}</h2>
                  <div className="text-sm text-muted-foreground">{race.country}</div>
                </div>
                <span
                  className={`rounded px-2 py-1 text-[11px] uppercase tracking-wide ${
                    done ? "bg-secondary text-muted-foreground" : "bg-primary/15 text-primary"
                  }`}
                >
                  {done ? "Gefahren" : "Geplant"}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-foreground">
                <CalendarDays className="size-4 text-primary" />
                {new Date(race.date).toLocaleDateString("de-DE", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <Slot label="Training" value={race.practice} />
                <Slot label="Qualifying" value={race.qualifying} />
                <Slot label="Rennen" value={race.race_time} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground sm:grid-cols-4">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="size-4 text-primary" />
                  Luft {race.air_temp}°
                </span>
                <span className="flex items-center gap-1.5">
                  <Thermometer className="size-4 text-primary" />
                  Strecke {race.track_temp}°
                </span>
                <span className="flex items-center gap-1.5">
                  <CloudRain className="size-4 text-primary" />
                  {race.rain_chance}% Regen
                </span>
                <span className="flex items-center gap-1.5">
                  <Timer className="size-4 text-primary" />
                  {race.time_multiplier}x Zeit
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}

function Slot({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-secondary/40 py-2">
      <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</div>
      <div className="font-display text-foreground">{value}</div>
    </div>
  );
}
