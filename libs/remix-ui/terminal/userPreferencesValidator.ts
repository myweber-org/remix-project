interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

const validateUserPreferences = (prefs: UserPreferences): void => {
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
    throw new PreferenceValidationError('Language must be specified');
  }

  const timezoneRegex = /^[A-Za-z_]+\/[A-Za-z_]+$/;
  if (!timezoneRegex.test(prefs.timezone)) {
    throw new PreferenceValidationError(
      `Invalid timezone format: ${prefs.timezone}. Expected format: Area/Location`
    );
  }
};

const sanitizePreferences = (prefs: Partial<UserPreferences>): UserPreferences => {
  return {
    theme: prefs.theme || 'auto',
    notifications: prefs.notifications ?? true,
    language: prefs.language || 'en-US',
    timezone: prefs.timezone || 'UTC'
  };
};

export { UserPreferences, PreferenceValidationError, validateUserPreferences, sanitizePreferences };