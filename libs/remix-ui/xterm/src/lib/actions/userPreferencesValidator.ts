interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string, public field: keyof UserPreferences) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

const validateUserPreferences = (prefs: Partial<UserPreferences>): UserPreferences => {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaults, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceValidationError(
      'Theme must be one of: light, dark, auto',
      'theme'
    );
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceValidationError(
      'Notifications must be a boolean value',
      'notifications'
    );
  }

  if (!validated.language || validated.language.trim().length === 0) {
    throw new PreferenceValidationError(
      'Language must be a non-empty string',
      'language'
    );
  }

  if (validated.fontSize < 8 || validated.fontSize > 32) {
    throw new PreferenceValidationError(
      'Font size must be between 8 and 32',
      'fontSize'
    );
  }

  return validated;
};

export { validateUserPreferences, PreferenceValidationError, UserPreferences };