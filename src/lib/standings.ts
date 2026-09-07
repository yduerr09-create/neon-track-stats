import type {
  Driver,
  DriverStanding,
  LeagueData,
  Result,
  TeamStanding,
} from "./league-types";

export function driverStandings(data: LeagueData): DriverStanding[] {
  const rows = data.drivers.map((driver) => {
    const res = data.results.filter((r) => r.driver_id === driver.id);
    return {
      driver,
      team: data.teams.find((t) => t.id === driver.team_id),
      points: sum(res.map((r) => r.points)),
      wins: res.filter((r) => r.position === 1).length,
      podiums: res.filter((r) => r.position <= 3).length,
      poles: res.filter((r) => r.pole).length,
      fastestLaps: res.filter((r) => r.fastest_lap).length,
      top5: res.filter((r) => r.position <= 5).length,
      top10: res.filter((r) => r.position <= 10).length,
      starts: res.length,
    };
  });

  rows.sort((a, b) => b.points - a.points || b.wins - a.wins);
  const leader = rows[0]?.points ?? 0;
  return rows.map((row, i) => ({
    ...row,
    pos: i + 1,
    gapToLeader: leader - row.points,
    interval: i === 0 ? 0 : (rows[i - 1]?.points ?? 0) - row.points,
  }));
}

export function teamStandings(data: LeagueData): TeamStanding[] {
  const rows = data.teams.map((team) => {
    const drivers = data.drivers.filter((d) => d.team_id === team.id);
    const ids = new Set(drivers.map((d) => d.id));
    const res = data.results.filter((r) => ids.has(r.driver_id));
    return {
      team,
      drivers,
      points: sum(res.map((r) => r.points)),
      wins: res.filter((r) => r.position === 1).length,
      podiums: res.filter((r) => r.position <= 3).length,
      poles: res.filter((r) => r.pole).length,
      fastestLaps: res.filter((r) => r.fastest_lap).length,
    };
  });

  rows.sort((a, b) => b.points - a.points || b.wins - a.wins);
  const leader = rows[0]?.points ?? 0;
  return rows.map((row, i) => ({
    ...row,
    pos: i + 1,
    gapToLeader: leader - row.points,
    interval: i === 0 ? 0 : (rows[i - 1]?.points ?? 0) - row.points,
  }));
}

export function driverSeason(data: LeagueData, driverId: string) {
  return data.races
    .map((race) => ({
      race,
      result: data.results.find(
        (r) => r.race_id === race.id && r.driver_id === driverId,
      ) as Result | undefined,
    }))
    .sort((a, b) => a.race.round - b.race.round);
}

export function teamDrivers(data: LeagueData, teamId: string): Driver[] {
  return data.drivers.filter((d) => d.team_id === teamId);
}

function sum(list: number[]) {
  return list.reduce((a, b) => a + b, 0);
}
