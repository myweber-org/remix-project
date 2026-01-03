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

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const errors: string[] = [];

  if (!prefs.theme || !['light', 'dark', 'auto'].includes(prefs.theme)) {
    errors.push('Theme must be one of: light, dark, auto');
  }

  if (typeof prefs.notifications !== 'boolean') {
    errors.push('Notifications must be a boolean value');
  }

  if (!prefs.language || !SUPPORTED_LANGUAGES.includes(prefs.language)) {
    errors.push(`Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }

  if (!prefs.timezone || !VALID_TIMEZONES.test(prefs.timezone)) {
    errors.push('Timezone must be in format: Area/Location (e.g., America/New_York)');
  }

  if (errors.length > 0) {
    throw new PreferenceValidationError(`Validation failed:\n${errors.join('\n')}`);
  }

  return prefs as UserPreferences;
}

function safeValidatePreferences(prefs: Partial<UserPreferences>): { valid: boolean; data?: UserPreferences; error?: string } {
  try {
    const validated = validateUserPreferences(prefs);
    return { valid: true, data: validated };
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      return { valid: false, error: error.message };
    }
    return { valid: false, error: 'Unknown validation error occurred' };
  }
}

export { validateUserPreferences, safeValidatePreferences, PreferenceValidationError, type UserPreferences };