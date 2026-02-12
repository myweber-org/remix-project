
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

function validateUserPreferences(prefs: unknown): UserPreferences {
  if (typeof prefs !== 'object' || prefs === null) {
    throw new PreferenceValidationError('Preferences must be an object');
  }

  const preferences = prefs as Record<string, unknown>;

  if (!['light', 'dark', 'auto'].includes(preferences.theme as string)) {
    throw new PreferenceValidationError('Theme must be light, dark, or auto');
  }

  if (typeof preferences.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }

  if (typeof preferences.language !== 'string' || preferences.language.length === 0) {
    throw new PreferenceValidationError('Language must be a non-empty string');
  }

  const itemsPerPage = Number(preferences.itemsPerPage);
  if (!Number.isInteger(itemsPerPage) || itemsPerPage < 5 || itemsPerPage > 100) {
    throw new PreferenceValidationError('Items per page must be an integer between 5 and 100');
  }

  return {
    theme: preferences.theme as 'light' | 'dark' | 'auto',
    notifications: preferences.notifications as boolean,
    language: preferences.language as string,
    itemsPerPage: itemsPerPage
  };
}

function applyUserPreferences(prefs: unknown): void {
  try {
    const validatedPrefs = validateUserPreferences(prefs);
    console.log('Applying preferences:', validatedPrefs);
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error('Invalid preferences:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

export { validateUserPreferences, applyUserPreferences, PreferenceValidationError };