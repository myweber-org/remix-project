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
    throw new PreferenceError('Theme must be light, dark, or auto', 'theme');
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceError('Notifications must be a boolean', 'notifications');
  }

  if (!validated.language || validated.language.trim().length === 0) {
    throw new PreferenceError('Language must be a non-empty string', 'language');
  }

  if (validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceError('Font size must be between 8 and 72', 'fontSize');
  }

  if (!Number.isInteger(validated.fontSize)) {
    throw new PreferenceError('Font size must be an integer', 'fontSize');
  }

  return validated;
}

function applyUserPreferences(prefs: Partial<UserPreferences>): void {
  try {
    const validated = validateUserPreferences(prefs);
    console.log('Applying preferences:', validated);
    // In a real application, this would update the UI or store preferences
  } catch (error) {
    if (error instanceof PreferenceError) {
      console.error(`Preference error in field "${error.field}": ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

export { validateUserPreferences, applyUserPreferences, PreferenceError };
export type { UserPreferences };typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    timezone: string;
}

class PreferenceValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
    private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

    static validate(prefs: UserPreferences): string[] {
        const errors: string[] = [];

        if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
            errors.push(`Invalid theme value: ${prefs.theme}`);
        }

        if (typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value');
        }

        if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
            errors.push(`Unsupported language: ${prefs.language}`);
        }

        if (!PreferenceValidator.VALID_TIMEZONES.test(prefs.timezone)) {
            errors.push(`Invalid timezone format: ${prefs.timezone}`);
        }

        return errors;
    }

    static validateAndThrow(prefs: UserPreferences): void {
        const errors = this.validate(prefs);
        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.join('; ')}`);
        }
    }
}

export { UserPreferences, PreferenceValidator };
```