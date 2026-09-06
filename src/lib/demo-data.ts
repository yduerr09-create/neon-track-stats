import type { Driver, LeagueData, Race, Result, Team } from "./league-types";
import { pointsForPosition } from "./league-types";

const TEAM_DEFS: [string, string, string[]][] = [
  ["Apex Velocity", "#39ff88", ["Lukas Brandt", "Marco Ferrari", "Jonas Weber"]],
  ["Nordschleife Racing", "#9ae6b4", ["Tim Hoffmann", "Elias Vogt", "Nils Sander"]],
  ["Silverline Motorsport", "#8fa3ad", ["Oliver Grant", "Sean Doyle", "Robin Kraus"]],
  ["Redline Collective", "#ff6b6b", ["Diego Alvarez", "Paulo Meireles", "Andre Kern"]],
  ["Aurora Simsport", "#59d0ff", ["Kim Larsen", "Ove Nyland", "Jesper Holm"]],
  ["Grid Zero eSports", "#d7ff5e", ["Yuki Tanaka", "Ren Fujita", "Kai Mori"]],
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

export function buildDemoData(): LeagueData {
  const rand = rng(20260907);
  const teams: Team[] = TEAM_DEFS.map((t, i) => ({
    id: `t${i + 1}`,
    name: t[0],
    color: t[1],
  }));

  const drivers: Driver[] = [];
  TEAM_DEFS.forEach((t, ti) => {
    t[2].forEach((name, di) => {
      const idx = ti * 3 + di;
      drivers.push({
        id: `d${idx + 1}`,
        name,
        team_id: `t${ti + 1}`,
        elo: Math.round(2100 - idx * 27 - rand() * 120),
        safety_rating: Math.round((9.4 - idx * 0.18 - rand() * 1.4) * 100) / 100,
        lifetime_points: Math.round(1800 - idx * 62 - rand() * 200),
        career_races: 40 + Math.round(rand() * 60),
        career_wins: Math.max(0, Math.round(14 - idx * 0.9 - rand() * 3)),
        career_podiums: Math.max(0, Math.round(34 - idx * 1.8 - rand() * 5)),
      });
    });
  });

  const races: Race[] = TRACKS.map((tr, i) => {
    const d = new Date(Date.UTC(2026, 1, 8 + i * 14, 19, 0));
    return {
      id: `r${i + 1}`,
      round: i + 1,
      track: tr[0],
      country: tr[1],
      date: d.toISOString(),
      practice: "18:30",
      qualifying: "19:00",
      race_time: "19:20",
      air_temp: 16 + Math.round(rand() * 14),
      track_temp: 22 + Math.round(rand() * 20),
      rain_chance: Math.round(rand() * 70),
      time_multiplier: [1, 1, 2, 3][Math.floor(rand() * 4)] ?? 1,
    };
  });

  const completed = 11;
  const results: Result[] = [];
  races.slice(0, completed).forEach((race) => {
    const order = [...drivers]
      .map((d) => ({ d, k: d.elo + (rand() - 0.5) * 420 }))
      .sort((a, b) => b.k - a.k)
      .map((x) => x.d);
    order.forEach((d, i) => {
      const pos = i + 1;
      results.push({
        id: `${race.id}-${d.id}`,
        race_id: race.id,
        driver_id: d.id,
        position: pos,
        grid: Math.max(1, Math.min(drivers.length, pos + Math.round((rand() - 0.5) * 6))),
        points: pointsForPosition(pos),
        incidents: Math.round(rand() * 4),
      });
    });
  });

  return { teams, drivers, races, results, source: "demo" };
}
