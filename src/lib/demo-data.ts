import type { Driver, Race, Result, Series, Team } from "./league-types";
import { pointsForPosition } from "./league-types";

type RawLeague = {
  seriesList: Series[];
  teams: Team[];
  drivers: Driver[];
  races: Race[];
  results: Result[];
};

const SERIES_DEFS: {
  id: string;
  name: string;
  description: string;
  teams: [string, string, string[]][];
  completed: number;
}[] = [
  {
    id: "s1",
    name: "GT3 Pro Series",
    description: "Die Königsklasse der Liga · 16 Rennwochenenden",
    completed: 11,
    teams: [
      ["Apex Velocity", "#39ff88", ["Lukas Brandt", "Marco Ferrari", "Jonas Weber"]],
      ["Nordschleife Racing", "#9ae6b4", ["Tim Hoffmann", "Elias Vogt", "Nils Sander"]],
      ["Silverline Motorsport", "#8fa3ad", ["Oliver Grant", "Sean Doyle", "Robin Kraus"]],
      ["Redline Collective", "#ff6b6b", ["Diego Alvarez", "Paulo Meireles", "Andre Kern"]],
      ["Aurora Simsport", "#59d0ff", ["Kim Larsen", "Ove Nyland", "Jesper Holm"]],
      ["Grid Zero eSports", "#d7ff5e", ["Yuki Tanaka", "Ren Fujita", "Kai Mori"]],
    ],
  },
  {
    id: "s2",
    name: "GT4 Challenge",
    description: "Einsteigerfreundliche Serie · gleiche Strecken, kürzere Rennen",
    completed: 7,
    teams: [
      ["Apex Velocity Junior", "#39ff88", ["Ben Sattler", "Luca Reinhard"]],
      ["Nordschleife Academy", "#9ae6b4", ["Mika Ebert", "Tom Reuter"]],
      ["Silverline Rookies", "#8fa3ad", ["Harry Wells", "Owen Blake"]],
      ["Redline Youth", "#ff6b6b", ["Rafael Costa", "Ivan Petrov"]],
      ["Aurora Development", "#59d0ff", ["Emil Berg", "Sofia Lind"]],
    ],
  },
];

const TRACKS: [string, string][] = [
  ["Monza", "Italien"],
  ["Spa-Francorchamps", "Belgien"],
  ["Nürburgring GP", "Deutschland"],
  ["Brands Hatch", "England"],
  ["Zandvoort", "Niederlande"],
  ["Barcelona", "Spanien"],
  ["Paul Ricard", "Frankreich"],
  ["Misano", "Italien"],
  ["Imola", "Italien"],
  ["Hungaroring", "Ungarn"],
  ["Kyalami", "Südafrika"],
  ["Suzuka", "Japan"],
  ["Bathurst", "Australien"],
  ["Watkins Glen", "USA"],
  ["Silverstone", "England"],
  ["Valencia", "Spanien"],
];

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function buildDemoData(): RawLeague {
  const rand = rng(20260907);
  const seriesList: Series[] = [];
  const teams: Team[] = [];
  const drivers: Driver[] = [];
  const races: Race[] = [];
  const results: Result[] = [];

  SERIES_DEFS.forEach((def, si) => {
    seriesList.push({
      id: def.id,
      name: def.name,
      description: def.description,
      sort_order: si + 1,
    });

    const seriesTeams: Team[] = def.teams.map((t, i) => ({
      id: `${def.id}-t${i + 1}`,
      series_id: def.id,
      name: t[0],
      color: t[1],
    }));
    teams.push(...seriesTeams);

    const seriesDrivers: Driver[] = [];
    def.teams.forEach((t, ti) => {
      t[2].forEach((name, di) => {
        const idx = seriesDrivers.length;
        seriesDrivers.push({
          id: `${def.id}-d${idx + 1}`,
          series_id: def.id,
          name,
          team_id: `${def.id}-t${ti + 1}`,
          elo: Math.round(2100 - idx * 27 - rand() * 120 - si * 200),
          safety_rating: Math.round((9.4 - idx * 0.18 - rand() * 1.4) * 100) / 100,
          lifetime_points: Math.round(1800 - idx * 62 - rand() * 200),
          career_races: 40 + Math.round(rand() * 60),
          career_wins: Math.max(0, Math.round(14 - idx * 0.9 - rand() * 3)),
          career_podiums: Math.max(0, Math.round(34 - idx * 1.8 - rand() * 5)),
          ...{ _: di },
        } as Driver);
      });
    });
    drivers.push(...seriesDrivers);

    const seriesRaces: Race[] = TRACKS.map((tr, i) => {
      const d = new Date(Date.UTC(2026, 1, 8 + i * 14, 19, 0));
      return {
        id: `${def.id}-r${i + 1}`,
        series_id: def.id,
        round: i + 1,
        track: tr[0],
        country: tr[1],
        date: d.toISOString(),
        practice: si === 0 ? "18:30" : "17:00",
        qualifying: si === 0 ? "19:00" : "17:30",
        race_time: si === 0 ? "19:20" : "17:50",
        air_temp: 16 + Math.round(rand() * 14),
        track_temp: 22 + Math.round(rand() * 20),
        rain_chance: Math.round(rand() * 70),
        time_multiplier: [1, 1, 2, 3][Math.floor(rand() * 4)] ?? 1,
      };
    });
    races.push(...seriesRaces);

    seriesRaces.slice(0, def.completed).forEach((race) => {
      const order = [...seriesDrivers]
        .map((d) => ({ d, k: d.elo + (rand() - 0.5) * 420 }))
        .sort((a, b) => b.k - a.k)
        .map((x) => x.d);
      const poleIdx = Math.floor(rand() * Math.min(4, order.length));
      const flIdx = Math.floor(rand() * Math.min(6, order.length));
      order.forEach((d, i) => {
        const pos = i + 1;
        results.push({
          id: `${race.id}-${d.id}`,
          race_id: race.id,
          driver_id: d.id,
          position: pos,
          grid: Math.max(
            1,
            Math.min(order.length, pos + Math.round((rand() - 0.5) * 6)),
          ),
          points: pointsForPosition(pos),
          incidents: Math.round(rand() * 4),
          pole: i === poleIdx,
          fastest_lap: i === flIdx,
        });
      });
    });
  });

  return { seriesList, teams, drivers, races, results };
}
