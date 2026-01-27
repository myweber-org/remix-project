
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
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaults, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceError(`Invalid theme: ${validated.theme}`, 'theme');
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceError('Notifications must be boolean', 'notifications');
  }

  if (!validated.language || validated.language.trim().length === 0) {
    throw new PreferenceError('Language cannot be empty', 'language');
  }

  if (validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceError('Font size must be between 8 and 72', 'fontSize');
  }

  if (!Number.isInteger(validated.fontSize)) {
    throw new PreferenceError('Font size must be an integer', 'fontSize');
  }

  return validated;
}

function formatValidationError(error: unknown): string {
  if (error instanceof PreferenceError) {
    return `Validation failed for field "${error.field}": ${error.message}`;
  }
  return 'Unknown validation error occurred';
}

export { validateUserPreferences, formatValidationError, PreferenceError };
export type { UserPreferences };