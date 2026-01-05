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
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: UserPreferences): void {
    if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
      throw new PreferenceValidationError(
        `Invalid theme: ${preferences.theme}. Must be 'light', 'dark', or 'auto'`
      );
    }

    if (typeof preferences.notifications !== 'boolean') {
      throw new PreferenceValidationError(
        `Notifications must be a boolean value, received: ${typeof preferences.notifications}`
      );
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      throw new PreferenceValidationError(
        `Unsupported language: ${preferences.language}. Supported languages: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    if (!UserPreferencesValidator.VALID_TIMEZONES.test(preferences.timezone)) {
      throw new PreferenceValidationError(
        `Invalid timezone format: ${preferences.timezone}. Expected format: Area/Location`
      );
    }
  }

  static sanitize(preferences: Partial<UserPreferences>): UserPreferences {
    return {
      theme: preferences.theme || 'auto',
      notifications: preferences.notifications ?? true,
      language: preferences.language || 'en',
      timezone: preferences.timezone || 'UTC'
    };
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };