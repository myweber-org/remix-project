interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Invalid theme: ${prefs.theme}. Must be one of: ${validThemes.join(', ')}`
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }

  if (!prefs.language || prefs.language.trim().length === 0) {
    throw new PreferenceValidationError('Language must be a non-empty string');
  }

  if (!Number.isInteger(prefs.fontSize) || prefs.fontSize < 8 || prefs.fontSize > 72) {
    throw new PreferenceValidationError('Font size must be an integer between 8 and 72');
  }
}

function loadUserPreferences(prefs: unknown): UserPreferences {
  if (!prefs || typeof prefs !== 'object') {
    throw new PreferenceValidationError('Preferences must be an object');
  }

  const preferences = prefs as Record<string, unknown>;
  const userPrefs: UserPreferences = {
    theme: preferences.theme as UserPreferences['theme'],
    notifications: Boolean(preferences.notifications),
    language: String(preferences.language || 'en'),
    fontSize: Number(preferences.fontSize || 16)
  };

  validateUserPreferences(userPrefs);
  return userPrefs;
}

export { UserPreferences, PreferenceValidationError, validateUserPreferences, loadUserPreferences };