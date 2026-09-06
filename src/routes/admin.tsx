import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useLeague } from "@/lib/use-league";
import { supabase } from "@/lib/supabase";
import { pointsForPosition } from "@/lib/league-types";
import { PageShell } from "@/components/page";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Rennergebnisse pflegen | ApexLeague" },
      {
        name: "description",
        content: "Rennergebnisse eintragen und bearbeiten: Fahrer, Team, Position, Punkte, Vorfälle.",
      },
      { property: "og:title", content: "Admin — Rennergebnisse pflegen" },
      {
        property: "og:description",
        content: "Ergebnisse der Liga eintragen und bearbeiten.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const schema = z.object({
  race_id: z.string().min(1, "Rennen wählen"),
  driver_id: z.string().min(1, "Fahrer wählen"),
  position: z.number().int().min(1).max(60),
  grid: z.number().int().min(1).max(60),
  points: z.number().int().min(0).max(100),
  incidents: z.number().int().min(0).max(50),
});

function AdminPage() {
  const { data } = useLeague();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    race_id: "",
    driver_id: "",
    position: 1,
    grid: 1,
    points: 25,
    incidents: 0,
  });
  const [saving, setSaving] = useState(false);

  const driver = data.drivers.find((d) => d.id === form.driver_id);
  const team = data.teams.find((t) => t.id === driver?.team_id);
  const existing = data.results.filter((r) => r.race_id === form.race_id);

  const setPosition = (pos: number) =>
    setForm((f) => ({ ...f, position: pos, points: pointsForPosition(pos) }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Bitte Eingaben prüfen");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("race_results")
      .upsert(
        {
          id: `${parsed.data.race_id}-${parsed.data.driver_id}`,
          ...parsed.data,
        },
        { onConflict: "id" },
      );
    setSaving(false);

    if (error) {
      toast.error(`Speichern fehlgeschlagen: ${error.message}`);
      return;
    }
    toast.success("Ergebnis gespeichert");
    queryClient.invalidateQueries({ queryKey: ["league"] });
  };

  return (
    <PageShell
      title="Admin-Bereich"
      subtitle="Rennergebnisse eintragen und bearbeiten"
    >
      {data.source === "demo" && (
        <div className="mb-6 rounded-md border border-primary/40 bg-primary/10 p-4 text-sm text-foreground">
          Aktuell werden Beispieldaten angezeigt, weil in der Datenbank noch keine Liga-Tabellen mit
          Inhalten gefunden wurden. Lege die Tabellen <code>teams</code>, <code>drivers</code>,{" "}
          <code>races</code> und <code>race_results</code> an (SQL liegt in{" "}
          <code>supabase/schema.sql</code>), dann erscheinen deine echten Daten automatisch.
        </div>
      )}

      <form onSubmit={submit} className="surface-card grid gap-4 p-5 md:grid-cols-2">
        <Field label="Rennen">
          <select
            value={form.race_id}
            onChange={(e) => setForm((f) => ({ ...f, race_id: e.target.value }))}
            className="input-dark"
          >
            <option value="">— wählen —</option>
            {data.races.map((r) => (
              <option key={r.id} value={r.id}>
                R{r.round} · {r.track}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Fahrer">
          <select
            value={form.driver_id}
            onChange={(e) => setForm((f) => ({ ...f, driver_id: e.target.value }))}
            className="input-dark"
          >
            <option value="">— wählen —</option>
            {data.drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Team (automatisch)">
          <input readOnly value={team?.name ?? "—"} className="input-dark opacity-70" />
        </Field>

        <Field label="Startplatz">
          <input
            type="number"
            min={1}
            value={form.grid}
            onChange={(e) => setForm((f) => ({ ...f, grid: Number(e.target.value) }))}
            className="input-dark"
          />
        </Field>

        <Field label="Position">
          <input
            type="number"
            min={1}
            value={form.position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="input-dark"
          />
        </Field>

        <Field label="Punkte">
          <input
            type="number"
            min={0}
            value={form.points}
            onChange={(e) => setForm((f) => ({ ...f, points: Number(e.target.value) }))}
            className="input-dark"
          />
        </Field>

        <Field label="Vorfälle (Safety Rating)">
          <input
            type="number"
            min={0}
            value={form.incidents}
            onChange={(e) => setForm((f) => ({ ...f, incidents: Number(e.target.value) }))}
            className="input-dark"
          />
        </Field>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="neon-glow w-full rounded-md bg-primary px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground disabled:opacity-60"
          >
            {saving ? "Speichern…" : "Ergebnis speichern"}
          </button>
        </div>
      </form>

      {form.race_id && (
        <>
          <h2 className="mt-10 mb-3 font-display text-sm uppercase tracking-[0.2em] text-primary">
            Bereits eingetragen
          </h2>
          <div className="surface-card overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  <th className="px-4 py-3">Pos</th>
                  <th className="px-4 py-3">Fahrer</th>
                  <th className="px-4 py-3 text-right">Start</th>
                  <th className="px-4 py-3 text-right">Punkte</th>
                  <th className="px-4 py-3 text-right">Vorfälle</th>
                  <th className="px-4 py-3 text-right">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {existing
                  .sort((a, b) => a.position - b.position)
                  .map((r) => (
                    <tr key={r.id} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-3 font-display text-primary">P{r.position}</td>
                      <td className="px-4 py-3 text-foreground">
                        {data.drivers.find((d) => d.id === r.driver_id)?.name ?? r.driver_id}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">P{r.grid}</td>
                      <td className="px-4 py-3 text-right text-foreground">{r.points}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{r.incidents}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              race_id: r.race_id,
                              driver_id: r.driver_id,
                              position: r.position,
                              grid: r.grid,
                              points: r.points,
                              incidents: r.incidents,
                            })
                          }
                          className="rounded border border-border px-2 py-1 text-xs uppercase tracking-wide text-foreground hover:border-primary hover:text-primary"
                        >
                          Bearbeiten
                        </button>
                      </td>
                    </tr>
                  ))}
                {!existing.length && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                      Noch keine Ergebnisse für dieses Rennen.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
