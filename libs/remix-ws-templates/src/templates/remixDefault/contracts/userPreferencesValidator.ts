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
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

function validateTheme(theme: string): theme is UserPreferences['theme'] {
  return ['light', 'dark', 'auto'].includes(theme);
}

function validateFontSize(size: number): boolean {
  return Number.isInteger(size) && size >= 8 && size <= 72;
}

function validateLanguage(lang: string): boolean {
  const supportedLanguages = ['en', 'es', 'fr', 'de', 'ja'];
  return supportedLanguages.includes(lang.toLowerCase());
}

export function validateUserPreferences(prefs: unknown): UserPreferences {
  if (typeof prefs !== 'object' || prefs === null) {
    throw new PreferenceValidationError('Preferences must be an object');
  }

  const preferences = prefs as Record<string, unknown>;

  if (!preferences.theme || typeof preferences.theme !== 'string') {
    throw new PreferenceValidationError('Theme must be a string');
  }

  if (!validateTheme(preferences.theme)) {
    throw new PreferenceValidationError('Theme must be light, dark, or auto');
  }

  if (typeof preferences.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean');
  }

  if (!preferences.language || typeof preferences.language !== 'string') {
    throw new PreferenceValidationError('Language must be a string');
  }

  if (!validateLanguage(preferences.language)) {
    throw new PreferenceValidationError('Unsupported language');
  }

  if (typeof preferences.fontSize !== 'number') {
    throw new PreferenceValidationError('Font size must be a number');
  }

  if (!validateFontSize(preferences.fontSize)) {
    throw new PreferenceValidationError('Font size must be between 8 and 72');
  }

  return {
    theme: preferences.theme as UserPreferences['theme'],
    notifications: preferences.notifications as boolean,
    language: preferences.language.toLowerCase(),
    fontSize: preferences.fontSize
  };
}