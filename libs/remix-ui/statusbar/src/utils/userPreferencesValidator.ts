
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

export function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaults, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceValidationError(`Invalid theme: ${validated.theme}. Must be 'light', 'dark', or 'auto'.`);
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value.');
  }

  if (typeof validated.language !== 'string' || validated.language.length !== 2) {
    throw new PreferenceValidationError('Language must be a 2-character ISO code.');
  }

  if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceValidationError('Font size must be a number between 8 and 72.');
  }

  return validated;
}

export function createUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  try {
    return validateUserPreferences(prefs);
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.warn(`Preference validation failed: ${error.message}. Using defaults.`);
      return validateUserPreferences({});
    }
    throw error;
  }
}