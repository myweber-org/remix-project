
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  fontSize: number;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  fontSize: 16,
  language: 'en-US'
};

const THEME_VALUES = ['light', 'dark', 'auto'] as const;

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (prefs.theme && THEME_VALUES.includes(prefs.theme)) {
    validated.theme = prefs.theme;
  }

  if (typeof prefs.notifications === 'boolean') {
    validated.notifications = prefs.notifications;
  }

  if (typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32) {
    validated.fontSize = prefs.fontSize;
  }

  if (typeof prefs.language === 'string' && /^[a-z]{2}-[A-Z]{2}$/.test(prefs.language)) {
    validated.language = prefs.language;
  }

  return validated;
}

function mergePreferences(
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  return validatePreferences({ ...existing, ...updates });
}

export { validatePreferences, mergePreferences, DEFAULT_PREFERENCES };
export type { UserPreferences };