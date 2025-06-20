import { z } from "zod";

export const clubSchema = z.object({
    id: z.string(),
    name: z.string(),
    country: z.string(),
    league: z.string(),
    primaryColor: z.string(),
    secondaryColor: z.string(),
    crestUrl: z.string(),
    teamId1: z.string(),
    teamId2: z.string(),
    slogan: z.string().optional(),
    abbreviation: z.string().optional()
  });
  