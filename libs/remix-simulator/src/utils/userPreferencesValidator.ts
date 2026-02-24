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
const MIN_RESULTS_PER_PAGE = 10;
const MAX_RESULTS_PER_PAGE = 100;

function validateUserPreferences(input: unknown): UserPreferences {
  if (!input || typeof input !== 'object') {
    return DEFAULT_PREFERENCES;
  }

  const partial = input as Partial<UserPreferences>;
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (partial.theme && ['light', 'dark', 'auto'].includes(partial.theme)) {
    validated.theme = partial.theme;
  }

  if (typeof partial.notifications === 'boolean') {
    validated.notifications = partial.notifications;
  }

  if (typeof partial.language === 'string' && VALID_LANGUAGES.has(partial.language)) {
    validated.language = partial.language;
  }

  if (typeof partial.resultsPerPage === 'number') {
    validated.resultsPerPage = Math.max(
      MIN_RESULTS_PER_PAGE,
      Math.min(MAX_RESULTS_PER_PAGE, partial.resultsPerPage)
    );
  }

  return validated;
}

export { validateUserPreferences, type UserPreferences };