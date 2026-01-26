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

const validateUserPreferences = (prefs: UserPreferences): void => {
  const errors: string[] = [];

  if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
    errors.push('Theme must be one of: light, dark, auto');
  }

  if (typeof prefs.notifications !== 'boolean') {
    errors.push('Notifications must be a boolean value');
  }

  if (!prefs.language || prefs.language.trim().length === 0) {
    errors.push('Language must be specified');
  }

  if (prefs.fontSize < 12 || prefs.fontSize > 24) {
    errors.push('Font size must be between 12 and 24');
  }

  if (errors.length > 0) {
    throw new PreferenceValidationError(`Invalid preferences: ${errors.join('; ')}`);
  }
};

const exampleUsage = () => {
  const validPrefs: UserPreferences = {
    theme: 'dark',
    notifications: true,
    language: 'en-US',
    fontSize: 16
  };

  const invalidPrefs: UserPreferences = {
    theme: 'blue' as any,
    notifications: 'yes' as any,
    language: '',
    fontSize: 30
  };

  try {
    validateUserPreferences(validPrefs);
    console.log('Valid preferences accepted');
  } catch (error) {
    console.error('Validation failed:', error.message);
  }

  try {
    validateUserPreferences(invalidPrefs);
  } catch (error) {
    console.error('Expected validation error:', error.message);
  }
};

export { validateUserPreferences, PreferenceValidationError, UserPreferences };