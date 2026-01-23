
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14
};

function validatePreferences(preferences: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (preferences.theme && ['light', 'dark', 'auto'].includes(preferences.theme)) {
    validated.theme = preferences.theme;
  }

  if (typeof preferences.notifications === 'boolean') {
    validated.notifications = preferences.notifications;
  }

  if (preferences.language && typeof preferences.language === 'string') {
    validated.language = preferences.language.trim();
  }

  if (preferences.fontSize && typeof preferences.fontSize === 'number') {
    validated.fontSize = Math.max(8, Math.min(72, preferences.fontSize));
  }

  return validated;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  return validatePreferences({ ...existing, ...updates });
}

export { UserPreferences, validatePreferences, mergePreferences };