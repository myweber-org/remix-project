
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  fontSize: number;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  fontSize: 16,
  language: 'en-US'
};

const THEME_VALUES = ['light', 'dark', 'auto'] as const;

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (prefs.theme && THEME_VALUES.includes(prefs.theme)) {
    validated.theme = prefs.theme;
  }

  if (typeof prefs.notifications === 'boolean') {
    validated.notifications = prefs.notifications;
  }

  if (typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32) {
    validated.fontSize = prefs.fontSize;
  }

  if (typeof prefs.language === 'string' && /^[a-z]{2}-[A-Z]{2}$/.test(prefs.language)) {
    validated.language = prefs.language;
  }

  return validated;
}

function mergePreferences(
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  return validatePreferences({ ...existing, ...updates });
}

export { validatePreferences, mergePreferences, DEFAULT_PREFERENCES };
export type { UserPreferences };import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).max(5).default('en')
}).strict();

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Invalid preferences: ${JSON.stringify(formattedErrors)}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validateUserPreferences(merged);
}
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  itemsPerPage: 25
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_ITEMS_PER_PAGE = 5;
const MAX_ITEMS_PER_PAGE = 100;

class PreferencesValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'PreferencesValidationError';
  }
}

function validateUserPreferences(input: unknown): UserPreferences {
  if (typeof input !== 'object' || input === null) {
    throw new PreferencesValidationError('Preferences must be an object');
  }

  const preferences = { ...DEFAULT_PREFERENCES, ...input } as Partial<UserPreferences>;
  const errors: string[] = [];

  if (preferences.theme !== undefined && !['light', 'dark', 'auto'].includes(preferences.theme)) {
    errors.push(`Theme must be one of: light, dark, auto`);
  }

  if (preferences.notifications !== undefined && typeof preferences.notifications !== 'boolean') {
    errors.push('Notifications must be a boolean value');
  }

  if (preferences.language !== undefined) {
    if (typeof preferences.language !== 'string') {
      errors.push('Language must be a string');
    } else if (!VALID_LANGUAGES.includes(preferences.language)) {
      errors.push(`Language must be one of: ${VALID_LANGUAGES.join(', ')}`);
    }
  }

  if (preferences.itemsPerPage !== undefined) {
    if (typeof preferences.itemsPerPage !== 'number') {
      errors.push('Items per page must be a number');
    } else if (preferences.itemsPerPage < MIN_ITEMS_PER_PAGE || preferences.itemsPerPage > MAX_ITEMS_PER_PAGE) {
      errors.push(`Items per page must be between ${MIN_ITEMS_PER_PAGE} and ${MAX_ITEMS_PER_PAGE}`);
    }
  }

  if (errors.length > 0) {
    throw new PreferencesValidationError(`Invalid preferences: ${errors.join('; ')}`);
  }

  return preferences as UserPreferences;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  const validatedUpdates = validateUserPreferences(updates);
  return { ...existing, ...validatedUpdates };
}

export { UserPreferences, validateUserPreferences, mergePreferences, PreferencesValidationError };