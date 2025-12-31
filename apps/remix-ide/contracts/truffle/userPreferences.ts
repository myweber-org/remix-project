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
  
  if (prefs.language && typeof prefs.language !== 'string') {
    return false;
  }
  
  return true;
}

function mergePreferences(defaultPrefs: UserPreferences, userPrefs: Partial<UserPreferences>): UserPreferences {
  if (!validatePreferences(userPrefs)) {
    throw new Error('Invalid user preferences provided');
  }
  
  return {
    ...defaultPrefs,
    ...userPrefs
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
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

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = DEFAULT_PREFERENCES.theme;
  }
  
  if (typeof validated.notifications !== 'boolean') {
    validated.notifications = DEFAULT_PREFERENCES.notifications;
  }
  
  if (typeof validated.language !== 'string' || validated.language.length < 2) {
    validated.language = DEFAULT_PREFERENCES.language;
  }
  
  if (!Number.isInteger(validated.resultsPerPage) || validated.resultsPerPage < 5 || validated.resultsPerPage > 100) {
    validated.resultsPerPage = DEFAULT_PREFERENCES.resultsPerPage;
  }
  
  return validated;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  return validatePreferences({ ...existing, ...updates });
}

export { UserPreferences, DEFAULT_PREFERENCES, validatePreferences, mergePreferences };