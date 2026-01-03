
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

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      timezone: 'UTC',
      ...preferences
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceValidationError(
        `Invalid theme: ${validated.theme}. Must be 'light', 'dark', or 'auto'`
      );
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceValidationError(
        `Notifications must be a boolean value, received: ${typeof validated.notifications}`
      );
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceValidationError(
        `Unsupported language: ${validated.language}. Supported: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    if (!UserPreferencesValidator.VALID_TIMEZONES.test(validated.timezone)) {
      throw new PreferenceValidationError(
        `Invalid timezone format: ${validated.timezone}. Expected format: Area/Location`
      );
    }

    return validated;
  }

  static validateBatch(preferencesList: Partial<UserPreferences>[]): UserPreferences[] {
    const results: UserPreferences[] = [];
    const errors: string[] = [];

    preferencesList.forEach((prefs, index) => {
      try {
        results.push(this.validate(prefs));
      } catch (error) {
        if (error instanceof PreferenceValidationError) {
          errors.push(`Item ${index}: ${error.message}`);
        }
      }
    });

    if (errors.length > 0) {
      throw new PreferenceValidationError(
        `Batch validation failed:\n${errors.join('\n')}`
      );
    }

    return results;
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };