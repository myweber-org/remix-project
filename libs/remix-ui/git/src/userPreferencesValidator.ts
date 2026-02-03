import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
}

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2),
  fontSize: z.number().min(8).max(72),
  autoSave: z.boolean(),
});

export const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14,
  autoSave: false,
};

export function validatePreferences(input: unknown): UserPreferences {
  try {
    const parsed = UserPreferencesSchema.parse(input);
    return { ...defaultPreferences, ...parsed };
  } catch (error) {
    console.warn('Invalid preferences provided, using defaults:', error);
    return defaultPreferences;
  }
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validatePreferences(merged);
}

export function arePreferencesEqual(
  a: UserPreferences,
  b: UserPreferences
): boolean {
  return (
    a.theme === b.theme &&
    a.notifications === b.notifications &&
    a.language === b.language &&
    a.fontSize === b.fontSize &&
    a.autoSave === b.autoSave
  );
}