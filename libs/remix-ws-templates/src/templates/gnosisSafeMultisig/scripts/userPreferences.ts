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

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = DEFAULT_PREFERENCES.theme;
  }
  
  if (typeof validated.notifications !== 'boolean') {
    validated.notifications = DEFAULT_PREFERENCES.notifications;
  }
  
  if (typeof validated.language !== 'string' || validated.language.length === 0) {
    validated.language = DEFAULT_PREFERENCES.language;
  }
  
  if (!Number.isInteger(validated.itemsPerPage) || validated.itemsPerPage < 1 || validated.itemsPerPage > 100) {
    validated.itemsPerPage = DEFAULT_PREFERENCES.itemsPerPage;
  }
  
  return validated;
}

function savePreferences(prefs: Partial<UserPreferences>): void {
  const validated = validatePreferences(prefs);
  localStorage.setItem('userPreferences', JSON.stringify(validated));
}

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  if (!stored) return DEFAULT_PREFERENCES;
  
  try {
    const parsed = JSON.parse(stored);
    return validatePreferences(parsed);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };