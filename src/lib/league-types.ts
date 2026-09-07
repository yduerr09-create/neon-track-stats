export type Series = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
};

export type Team = {
  id: string;
  series_id: string;
  name: string;
  color: string;
};

export type Driver = {
  id: string;
  series_id: string;
  name: string;
  team_id: string;
  elo: number;
  safety_rating: number;
  lifetime_points: number;
  career_races: number;
  career_wins: number;
  career_podiums: number;
};

export type Race = {
  id: string;
  series_id: string;
  round: number;
  track: string;
  country: string;
  date: string;
  practice: string;
  qualifying: string;
  race_time: string;
  air_temp: number;
  track_temp: number;
  rain_chance: number;
  time_multiplier: number;
};

export type Result = {
  id: string;
  race_id: string;
  driver_id: string;
  position: number;
  grid: number;
  points: number;
  incidents: number;
  pole: boolean;
  fastest_lap: boolean;
};

export type LeagueData = {
  seriesList: Series[];
  series: Series | undefined;
  teams: Team[];
  drivers: Driver[];
  races: Race[];
  results: Result[];
  source: "supabase" | "demo";
};

export type DriverStanding = {
  pos: number;
  driver: Driver;
  team: Team | undefined;
  points: number;
  gapToLeader: number;
  interval: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  top5: number;
  top10: number;
  starts: number;
};

export type TeamStanding = {
  pos: number;
  team: Team;
  points: number;
  gapToLeader: number;
  interval: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  drivers: Driver[];
};

export const POINTS_TABLE = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

export function pointsForPosition(pos: number): number {
  return POINTS_TABLE[pos - 1] ?? 0;
}
