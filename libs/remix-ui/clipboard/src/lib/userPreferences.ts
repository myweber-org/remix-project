import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  locale: z.string().min(2).max(5).default('en-US'),
  timezone: z.string().default('UTC')
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  notifications: {
    email: true,
    push: false,
    frequency: 'daily'
  },
  privacy: {
    profileVisibility: 'friends',
    searchIndexing: true
  },
  locale: 'en-US',
  timezone: 'UTC'
};

export function validatePreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing };
  
  for (const key in updates) {
    if (updates[key] !== undefined) {
      if (typeof updates[key] === 'object' && updates[key] !== null) {
        merged[key] = { ...merged[key], ...updates[key] };
      } else {
        merged[key] = updates[key];
      }
    }
  }
  
  return validatePreferences({ ...DEFAULT_PREFERENCES, ...merged });
}

export function isPreferencesValid(prefs: unknown): prefs is UserPreferences {
  return UserPreferencesSchema.safeParse(prefs).success;
}