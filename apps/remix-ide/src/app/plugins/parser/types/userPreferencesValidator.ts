interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceError';
  }
}

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const errors: string[] = [];

  if (!prefs.theme || !['light', 'dark', 'auto'].includes(prefs.theme)) {
    errors.push('Theme must be light, dark, or auto');
  }

  if (typeof prefs.notifications !== 'boolean') {
    errors.push('Notifications must be a boolean value');
  }

  if (!prefs.language || typeof prefs.language !== 'string' || prefs.language.length < 2) {
    errors.push('Language must be a string with at least 2 characters');
  }

  if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
    errors.push('Font size must be between 8 and 72');
  }

  if (errors.length > 0) {
    throw new PreferenceError(errors.join('; '), 'validation');
  }

  return prefs as UserPreferences;
}

function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  try {
    const validatedPrefs = validateUserPreferences(prefs);
    console.log('Preferences saved:', validatedPrefs);
  } catch (error) {
    if (error instanceof PreferenceError) {
      console.error(`Validation failed for ${error.field}:`, error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}