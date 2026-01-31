interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  itemsPerPage: 25
};

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = 'auto';
  }
  
  if (typeof validated.language !== 'string' || validated.language.trim() === '') {
    validated.language = 'en-US';
  }
  
  if (typeof validated.notificationsEnabled !== 'boolean') {
    validated.notificationsEnabled = true;
  }
  
  if (!Number.isInteger(validated.itemsPerPage) || validated.itemsPerPage < 1 || validated.itemsPerPage > 100) {
    validated.itemsPerPage = 25;
  }
  
  return validated;
}

function savePreferences(prefs: Partial<UserPreferences>): void {
  const validatedPrefs = validatePreferences(prefs);
  localStorage.setItem('userPreferences', JSON.stringify(validatedPrefs));
}

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return validatePreferences(parsed);
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }
  return DEFAULT_PREFERENCES;
}

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };