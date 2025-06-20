import z from "zod";

export const fixtureSchema = z.object({
      Id: z.number(),
      external_id: z.number(),
      start_time: z.date(),
      Completed: z.boolean(),
      home_team_external_id: z.number(),
      away_team_external_id: z.number(),
      MatchState: z.enum(['FT', 'HT']),    
      Scores: z.string()
})
