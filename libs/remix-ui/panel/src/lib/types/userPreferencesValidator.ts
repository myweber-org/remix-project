import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  resultsPerPage: z.number().min(5).max(100).default(20),
  language: z.string().length(2).default('en')
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  const result = UserPreferencesSchema.safeParse(input);
  
  if (!result.success) {
    console.warn('Invalid preferences, using defaults:', result.error.format());
    return UserPreferencesSchema.parse({});
  }
  
  return result.data;
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validatePreferences(merged);
}

export const DEFAULT_PREFERENCES = UserPreferencesSchema.parse({});