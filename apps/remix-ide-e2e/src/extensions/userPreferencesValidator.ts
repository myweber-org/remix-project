import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  itemsPerPage: z.number().int().min(5).max(100)
});

export function validateUserPreferences(data: unknown): UserPreferences {
  const result = UserPreferencesSchema.safeParse(data);
  
  if (!result.success) {
    const errorMessages = result.error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    
    throw new Error(`Invalid user preferences: ${errorMessages}`);
  }
  
  return result.data;
}

export function createDefaultPreferences(): UserPreferences {
  return {
    theme: 'auto',
    notifications: true,
    language: 'en',
    itemsPerPage: 20
  };
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const defaultPrefs = createDefaultPreferences();
  
  return {
    ...defaultPrefs,
    ...existing,
    ...updates
  };
}