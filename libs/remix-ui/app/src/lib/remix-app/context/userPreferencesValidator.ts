interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const errors: string[] = [];

  if (!prefs.theme || !['light', 'dark', 'auto'].includes(prefs.theme)) {
    errors.push('Theme must be either light, dark, or auto');
  }

  if (typeof prefs.notifications !== 'boolean') {
    errors.push('Notifications must be a boolean value');
  }

  if (!prefs.language || typeof prefs.language !== 'string' || prefs.language.length < 2) {
    errors.push('Language must be a string with at least 2 characters');
  }

  if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
    errors.push('Font size must be a number between 8 and 72');
  }

  if (errors.length > 0) {
    throw new PreferenceValidationError(`Validation failed: ${errors.join('; ')}`, 'preferences');
  }

  return prefs as UserPreferences;
}

function updateUserPreferences(newPrefs: Partial<UserPreferences>): void {
  try {
    const validatedPrefs = validateUserPreferences(newPrefs);
    console.log('Preferences updated successfully:', validatedPrefs);
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error(`Failed to update preferences: ${error.message}`);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}