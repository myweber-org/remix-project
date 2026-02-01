import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  itemsPerPage: z.number().int().min(5).max(100),
});

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  itemsPerPage: 20,
};

export function validatePreferences(input: unknown): UserPreferences {
  try {
    const parsed = UserPreferencesSchema.parse(input);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('Invalid preferences provided, using defaults:', error.errors);
    }
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

export function isPreferencesValid(prefs: UserPreferences): boolean {
  return UserPreferencesSchema.safeParse(prefs).success;
}
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
  timezone?: string;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MIN_ITEMS_PER_PAGE = 5;
  private static readonly MAX_ITEMS_PER_PAGE = 100;
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push('Theme must be light, dark, or auto');
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Language must be one of: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (prefs.itemsPerPage < PreferenceValidator.MIN_ITEMS_PER_PAGE || 
        prefs.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
      errors.push(`Items per page must be between ${PreferenceValidator.MIN_ITEMS_PER_PAGE} and ${PreferenceValidator.MAX_ITEMS_PER_PAGE}`);
    }

    if (prefs.timezone && !PreferenceValidator.VALID_TIMEZONES.test(prefs.timezone)) {
      errors.push('Timezone must be in format Area/Location (e.g., America/New_York)');
    }

    return errors;
  }

  static validateAndThrow(prefs: UserPreferences): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Invalid preferences: ${errors.join('; ')}`);
    }
  }
}

export { UserPreferences, PreferenceValidator };