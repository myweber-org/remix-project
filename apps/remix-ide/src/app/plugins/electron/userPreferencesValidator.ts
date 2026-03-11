
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
  language: 'en'
};

const THEME_VALUES = ['light', 'dark', 'auto'] as const;
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;
const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];

function validatePreferences(input: unknown): UserPreferences {
  if (!input || typeof input !== 'object') {
    return DEFAULT_PREFERENCES;
  }

  const partial = input as Partial<UserPreferences>;
  const result: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (partial.theme && THEME_VALUES.includes(partial.theme)) {
    result.theme = partial.theme;
  }

  if (typeof partial.notifications === 'boolean') {
    result.notifications = partial.notifications;
  }

  if (typeof partial.fontSize === 'number') {
    result.fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, partial.fontSize));
  }

  if (typeof partial.language === 'string' && SUPPORTED_LANGUAGES.includes(partial.language)) {
    result.language = partial.language;
  }

  return result;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  const validatedUpdates = validatePreferences(updates);
  return { ...existing, ...validatedUpdates };
}

export { validatePreferences, mergePreferences, DEFAULT_PREFERENCES };
export type { UserPreferences };