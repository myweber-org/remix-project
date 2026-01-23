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

const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
const VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

function validateUserPreferences(prefs: UserPreferences): void {
  if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
    throw new PreferenceValidationError('Theme must be light, dark, or auto');
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }

  if (!SUPPORTED_LANGUAGES.includes(prefs.language)) {
    throw new PreferenceValidationError(`Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }

  if (!VALID_TIMEZONES.test(prefs.timezone)) {
    throw new PreferenceValidationError('Timezone must be in format Area/Location');
  }
}

function normalizePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    timezone: 'UTC'
  };

  const merged = { ...defaults, ...prefs };
  validateUserPreferences(merged);
  return merged;
}

export { UserPreferences, PreferenceValidationError, validateUserPreferences, normalizePreferences };