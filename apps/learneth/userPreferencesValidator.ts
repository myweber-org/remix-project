import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
  autoSave: boolean;
}

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  itemsPerPage: z.number().int().min(5).max(100),
  autoSave: z.boolean(),
});

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  itemsPerPage: 25,
  autoSave: false,
};

export function validatePreferences(input: unknown): UserPreferences {
  const result = UserPreferencesSchema.safeParse(input);
  
  if (!result.success) {
    console.warn('Invalid preferences detected, using defaults:', result.error.errors);
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

export function getStoredPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem('userPreferences');
    if (!stored) return DEFAULT_PREFERENCES;
    
    const parsed = JSON.parse(stored);
    return validatePreferences(parsed);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  const validated = validatePreferences(prefs);
  localStorage.setItem('userPreferences', JSON.stringify(validated));
}