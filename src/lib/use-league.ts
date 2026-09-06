import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { buildDemoData } from "./demo-data";
import type { Driver, LeagueData, Race, Result, Team } from "./league-types";

async function fetchLeague(): Promise<LeagueData> {
  try {
    const [teams, drivers, races, results] = await Promise.all([
      supabase.from("teams").select("*"),
      supabase.from("drivers").select("*"),
      supabase.from("races").select("*"),
      supabase.from("race_results").select("*"),
    ]);

    if (teams.error || drivers.error || races.error || results.error) {
      return buildDemoData();
    }
    if (!teams.data?.length || !drivers.data?.length) {
      return buildDemoData();
    }

    return {
      teams: teams.data as Team[],
      drivers: drivers.data as Driver[],
      races: (races.data ?? []) as Race[],
      results: (results.data ?? []) as Result[],
      source: "supabase",
    };
  } catch {
    return buildDemoData();
  }
}

export function useLeague() {
  return useQuery({
    queryKey: ["league"],
    queryFn: fetchLeague,
    staleTime: 30_000,
    initialData: buildDemoData,
  });
}
