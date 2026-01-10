import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  language: z.string().min(2).default('en'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisible: z.boolean().default(true),
    searchIndexed: z.boolean().default(false),
    dataSharing: z.boolean().default(false)
  })
}).strict();

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en',
  notifications: {
    email: true,
    push: false,
    frequency: 'daily'
  },
  privacy: {
    profileVisible: true,
    searchIndexed: false,
    dataSharing: false
  }
};

export function validatePreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...DEFAULT_PREFERENCES, ...existing, ...updates };
  return validatePreferences(merged);
}

export function isPreferencesValid(prefs: unknown): prefs is UserPreferences {
  return UserPreferencesSchema.safeParse(prefs).success;
}