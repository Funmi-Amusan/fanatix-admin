import z from "zod";

export const fixtureSchema = z.object({
      matchId: z.string(),
      fixtureId: z.string(),
      homeTeamId: z.string(),
      homeTeamName: z.string(),
      homeTeamImageUrl: z.string(),
      awayTeamId: z.string(),
      awayTeamName: z.string(),
      awayTeamImageUrl: z.string(),
      matchStartTime: z.date(),
      homeScore: z.number(),
      awayScore: z.number(),
      Completed: z.boolean(),
      away_team_external_id: z.number(),
      matchState: z.enum(['FT', 'HT']),    
      leagueName: z.string(),
      leagueImageUrl: z.string(),
      lastUpdated:  z.date(),
      createdAt: z.date(),
})

export type Fixture = z.infer<typeof fixtureSchema>;
