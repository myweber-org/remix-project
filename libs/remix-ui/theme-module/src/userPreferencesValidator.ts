import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2),
  fontSize: z.number().min(8).max(32),
});

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14,
};

export function validatePreferences(input: unknown): UserPreferences {
  const result = UserPreferencesSchema.safeParse(input);
  
  if (!result.success) {
    console.warn('Invalid preferences detected, using defaults:', result.error.format());
    return DEFAULT_PREFERENCES;
  }
  
  return result.data;
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...DEFAULT_PREFERENCES, ...existing, ...updates };
  return validatePreferences(merged);
}

export function isDarkThemePreferred(prefs: UserPreferences): boolean {
  if (prefs.theme === 'dark') return true;
  if (prefs.theme === 'light') return false;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}