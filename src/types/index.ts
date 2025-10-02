import { z } from "zod";

const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  fullName: z.string(),
  image: z.string().url().optional(),
  country: z.string(),
  investmentGoals: z.string(),
  riskTolerance: z.string(),
  preferredIndustry: z.string(),
});

export type User = z.infer<typeof userSchema>;
