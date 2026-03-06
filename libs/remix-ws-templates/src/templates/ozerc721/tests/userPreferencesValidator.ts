import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notificationsEnabled: z.boolean().default(true),
  emailFrequency: z.enum(['immediate', 'daily', 'weekly']).default('daily'),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().optional(),
  itemsPerPage: z.number().min(5).max(100).default(25),
  twoFactorEnabled: z.boolean().default(false)
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const defaultPreferences = UserPreferencesSchema.parse({});
      console.warn('Invalid preferences, using defaults:', error.errors);
      return defaultPreferences;
    }
    throw error;
  }
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validateUserPreferences(merged);
}

export function getPreferencesDiff(
  oldPrefs: UserPreferences,
  newPrefs: UserPreferences
): Partial<UserPreferences> {
  const diff: Partial<UserPreferences> = {};
  
  (Object.keys(oldPrefs) as Array<keyof UserPreferences>).forEach(key => {
    if (oldPrefs[key] !== newPrefs[key]) {
      diff[key] = newPrefs[key];
    }
  });
  
  return diff;
}