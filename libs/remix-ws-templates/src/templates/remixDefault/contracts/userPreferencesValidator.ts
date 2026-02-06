import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  fontSize: number;
  language: string;
}

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  fontSize: z.number().min(12).max(24),
  language: z.string().min(2).max(5),
});

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  fontSize: 16,
  language: 'en',
};

export function validatePreferences(input: unknown): UserPreferences {
  try {
    const parsed = UserPreferencesSchema.parse(input);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch (error) {
    console.warn('Invalid preferences provided, using defaults:', error);
    return DEFAULT_PREFERENCES;
  }
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validatePreferences(merged);
}