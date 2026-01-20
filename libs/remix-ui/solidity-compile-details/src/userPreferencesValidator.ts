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
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaultPreferences };

  if (prefs.theme !== undefined) {
    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      throw new PreferenceError('Theme must be light, dark, or auto', 'theme');
    }
    validated.theme = prefs.theme;
  }

  if (prefs.notifications !== undefined) {
    if (typeof prefs.notifications !== 'boolean') {
      throw new PreferenceError('Notifications must be a boolean value', 'notifications');
    }
    validated.notifications = prefs.notifications;
  }

  if (prefs.language !== undefined) {
    if (typeof prefs.language !== 'string' || prefs.language.length < 2) {
      throw new PreferenceError('Language must be a string with at least 2 characters', 'language');
    }
    validated.language = prefs.language;
  }

  if (prefs.fontSize !== undefined) {
    if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
      throw new PreferenceError('Font size must be between 8 and 72', 'fontSize');
    }
    validated.fontSize = prefs.fontSize;
  }

  return validated;
}

function testValidation() {
  try {
    const validPrefs = validateUserPreferences({
      theme: 'dark',
      fontSize: 16
    });
    console.log('Valid preferences:', validPrefs);
  } catch (error) {
    if (error instanceof PreferenceError) {
      console.error(`Validation failed for ${error.field}: ${error.message}`);
    }
  }
}