interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 14,
  autoSave: true
};

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
    validated.theme = prefs.theme;
  }

  if (typeof prefs.notifications === 'boolean') {
    validated.notifications = prefs.notifications;
  }

  if (prefs.language && typeof prefs.language === 'string') {
    validated.language = prefs.language;
  }

  if (prefs.fontSize && prefs.fontSize >= 8 && prefs.fontSize <= 24) {
    validated.fontSize = prefs.fontSize;
  }

  if (typeof prefs.autoSave === 'boolean') {
    validated.autoSave = prefs.autoSave;
  }

  return validated;
}

function savePreferences(prefs: Partial<UserPreferences>): void {
  const validatedPrefs = validatePreferences(prefs);
  localStorage.setItem('userPreferences', JSON.stringify(validatedPrefs));
  console.log('Preferences saved successfully');
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