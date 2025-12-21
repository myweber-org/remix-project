
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONE_REGEX = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push('Theme must be one of: light, dark, auto');
    }

    if (typeof preferences.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Language must be one of: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (!UserPreferencesValidator.VALID_TIMEZONE_REGEX.test(preferences.timezone)) {
      errors.push('Timezone must be in format: Area/Location (e.g., America/New_York)');
    }

    return errors;
  }

  static validateAndThrow(preferences: UserPreferences): void {
    const errors = this.validate(preferences);
    if (errors.length > 0) {
      throw new Error(`Invalid preferences: ${errors.join('; ')}`);
    }
  }
}

export { UserPreferences, UserPreferencesValidator };