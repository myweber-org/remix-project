interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

function validatePreferences(prefs: Partial<UserPreferences>): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (prefs.theme && !validThemes.includes(prefs.theme)) {
    return false;
  }

  if (prefs.itemsPerPage !== undefined) {
    if (!Number.isInteger(prefs.itemsPerPage) || prefs.itemsPerPage < 1 || prefs.itemsPerPage > 100) {
      return false;
    }
  }

  if (prefs.language !== undefined) {
    const languageRegex = /^[a-z]{2}(-[A-Z]{2})?$/;
    if (!languageRegex.test(prefs.language)) {
      return false;
    }
  }

  return true;
}

function mergePreferences(
  current: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences | null {
  if (!validatePreferences(updates)) {
    return null;
  }

  return {
    ...current,
    ...updates
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  itemsPerPage: 20
};interface UserPreferences {
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

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_RESULTS_PER_PAGE = 10;
const MAX_RESULTS_PER_PAGE = 100;

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
    validated.theme = prefs.theme;
  }

  if (typeof prefs.notifications === 'boolean') {
    validated.notifications = prefs.notifications;
  }

  if (prefs.language && VALID_LANGUAGES.includes(prefs.language)) {
    validated.language = prefs.language;
  }

  if (typeof prefs.resultsPerPage === 'number') {
    validated.resultsPerPage = Math.max(
      MIN_RESULTS_PER_PAGE,
      Math.min(MAX_RESULTS_PER_PAGE, prefs.resultsPerPage)
    );
  }

  return validated;
}

function loadUserPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem('userPreferences');
    if (stored) {
      const parsed = JSON.parse(stored);
      return validatePreferences(parsed);
    }
  } catch (error) {
    console.warn('Failed to load user preferences:', error);
  }
  return DEFAULT_PREFERENCES;
}

function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  const current = loadUserPreferences();
  const updated = validatePreferences({ ...current, ...prefs });
  localStorage.setItem('userPreferences', JSON.stringify(updated));
}

export { UserPreferences, loadUserPreferences, saveUserPreferences };