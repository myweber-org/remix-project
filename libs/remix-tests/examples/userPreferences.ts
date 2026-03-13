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

function savePreferences(prefs: Partial<UserPreferences>): void {
  const validated = validatePreferences(prefs);
  localStorage.setItem('userPreferences', JSON.stringify(validated));
}

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  if (!stored) {
    return DEFAULT_PREFERENCES;
  }

  try {
    const parsed = JSON.parse(stored);
    return validatePreferences(parsed);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    searchIndexing: boolean;
  };
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: {
    email: true,
    push: false,
    frequency: 'daily'
  },
  privacy: {
    profileVisibility: 'private',
    searchIndexing: false
  }
};

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = DEFAULT_PREFERENCES.theme;
  }
  
  if (!['instant', 'daily', 'weekly'].includes(validated.notifications.frequency)) {
    validated.notifications.frequency = DEFAULT_PREFERENCES.notifications.frequency;
  }
  
  if (!['public', 'private', 'friends'].includes(validated.privacy.profileVisibility)) {
    validated.privacy.profileVisibility = DEFAULT_PREFERENCES.privacy.profileVisibility;
  }
  
  return validated;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  const merged = {
    ...existing,
    ...updates,
    notifications: { ...existing.notifications, ...updates.notifications },
    privacy: { ...existing.privacy, ...updates.privacy }
  };
  
  return validatePreferences(merged);
}

export { UserPreferences, DEFAULT_PREFERENCES, validatePreferences, mergePreferences };