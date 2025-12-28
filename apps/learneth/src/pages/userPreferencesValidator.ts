interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class PreferenceValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const errors: string[] = [];

    if (!preferences.theme || !['light', 'dark', 'auto'].includes(preferences.theme)) {
      throw new PreferenceValidationError(
        'Theme must be one of: light, dark, auto',
        'theme'
      );
    }

    if (typeof preferences.notifications !== 'boolean') {
      throw new PreferenceValidationError(
        'Notifications must be a boolean value',
        'notifications'
      );
    }

    if (!preferences.language || !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      throw new PreferenceValidationError(
        `Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`,
        'language'
      );
    }

    if (!preferences.timezone || !this.VALID_TIMEZONES.test(preferences.timezone)) {
      throw new PreferenceValidationError(
        'Timezone must be in format: Area/Location (e.g., America/New_York)',
        'timezone'
      );
    }

    return preferences as UserPreferences;
  }

  static validatePartial(preferences: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (preferences.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
        throw new PreferenceValidationError(
          'Theme must be one of: light, dark, auto',
          'theme'
        );
      }
      validated.theme = preferences.theme;
    }

    if (preferences.notifications !== undefined) {
      if (typeof preferences.notifications !== 'boolean') {
        throw new PreferenceValidationError(
          'Notifications must be a boolean value',
          'notifications'
        );
      }
      validated.notifications = preferences.notifications;
    }

    if (preferences.language !== undefined) {
      if (!this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
        throw new PreferenceValidationError(
          `Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`,
          'language'
        );
      }
      validated.language = preferences.language;
    }

    if (preferences.timezone !== undefined) {
      if (!this.VALID_TIMEZONES.test(preferences.timezone)) {
        throw new PreferenceValidationError(
          'Timezone must be in format: Area/Location',
          'timezone'
        );
      }
      validated.timezone = preferences.timezone;
    }

    return validated;
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };