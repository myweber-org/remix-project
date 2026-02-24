
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

export function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const errors: string[] = [];

  if (!prefs.theme || !['light', 'dark', 'auto'].includes(prefs.theme)) {
    errors.push('Theme must be light, dark, or auto');
  }

  if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
    errors.push('Notifications must be a boolean value');
  }

  if (prefs.language && typeof prefs.language !== 'string') {
    errors.push('Language must be a string');
  }

  if (prefs.fontSize !== undefined) {
    if (typeof prefs.fontSize !== 'number') {
      errors.push('Font size must be a number');
    } else if (prefs.fontSize < 12 || prefs.fontSize > 24) {
      errors.push('Font size must be between 12 and 24');
    }
  }

  if (errors.length > 0) {
    throw new PreferenceError(errors.join('; '), 'validation');
  }

  return {
    theme: prefs.theme || 'auto',
    notifications: prefs.notifications ?? true,
    language: prefs.language || 'en',
    fontSize: prefs.fontSize || 16,
  };
}

export function parsePreferencesFromJSON(jsonString: string): UserPreferences {
  try {
    const parsed = JSON.parse(jsonString);
    return validateUserPreferences(parsed);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new PreferenceError('Invalid JSON format', 'parsing');
    }
    throw error;
  }
}