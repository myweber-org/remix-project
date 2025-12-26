interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
  autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en',
  notificationsEnabled: true,
  fontSize: 14,
  autoSave: true
};

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = DEFAULT_PREFERENCES.theme;
  }
  
  if (typeof validated.language !== 'string' || validated.language.trim() === '') {
    validated.language = DEFAULT_PREFERENCES.language;
  }
  
  if (typeof validated.notificationsEnabled !== 'boolean') {
    validated.notificationsEnabled = DEFAULT_PREFERENCES.notificationsEnabled;
  }
  
  if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 72) {
    validated.fontSize = DEFAULT_PREFERENCES.fontSize;
  }
  
  if (typeof validated.autoSave !== 'boolean') {
    validated.autoSave = DEFAULT_PREFERENCES.autoSave;
  }
  
  return validated;
}

function savePreferences(prefs: UserPreferences): void {
  localStorage.setItem('userPreferences', JSON.stringify(prefs));
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

export { UserPreferences, validatePreferences, savePreferences, loadPreferences, DEFAULT_PREFERENCES };