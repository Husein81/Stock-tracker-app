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

export const alertSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  name: z.string(),
  stockIdentifier: z.string(),
  type: z.enum(["price", "volume"]),
  condition: z.enum(["greater_than", "less_than"]),
  threshold: z.number(),
  frequency: z.enum(["once_per_minute", "once_per_hour", "once_per_day"]),
});

export const watchlistSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  symbol: z.string(),
  company: z.string(),
  addedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
export type Alert = z.infer<typeof alertSchema>;
export type Watchlist = z.infer<typeof watchlistSchema>;
