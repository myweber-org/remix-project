interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 14
};

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated = { ...DEFAULT_PREFERENCES, ...prefs };
  
  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    validated.theme = 'auto';
  }
  
  if (typeof validated.language !== 'string' || validated.language.trim().length === 0) {
    validated.language = DEFAULT_PREFERENCES.language;
  }
  
  if (typeof validated.notificationsEnabled !== 'boolean') {
    validated.notificationsEnabled = DEFAULT_PREFERENCES.notificationsEnabled;
  }
  
  if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 32) {
    validated.fontSize = DEFAULT_PREFERENCES.fontSize;
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

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };