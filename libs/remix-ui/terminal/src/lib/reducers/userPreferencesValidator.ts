interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  resultsPerPage: 20
};

const VALID_LANGUAGES = new Set(['en-US', 'es-ES', 'fr-FR', 'de-DE']);
const MAX_RESULTS_PER_PAGE = 100;

function validatePreferences(input: unknown): UserPreferences {
  if (!input || typeof input !== 'object') {
    return DEFAULT_PREFERENCES;
  }

  const partial = input as Partial<UserPreferences>;
  const preferences: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (partial.theme && ['light', 'dark', 'auto'].includes(partial.theme)) {
    preferences.theme = partial.theme;
  }

  if (typeof partial.notifications === 'boolean') {
    preferences.notifications = partial.notifications;
  }

  if (typeof partial.language === 'string' && VALID_LANGUAGES.has(partial.language)) {
    preferences.language = partial.language;
  }

  if (typeof partial.resultsPerPage === 'number') {
    preferences.resultsPerPage = Math.max(1, Math.min(partial.resultsPerPage, MAX_RESULTS_PER_PAGE));
  }

  return preferences;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  const validatedUpdates = validatePreferences(updates);
  return { ...existing, ...validatedUpdates };
}

export { UserPreferences, validatePreferences, mergePreferences, DEFAULT_PREFERENCES };