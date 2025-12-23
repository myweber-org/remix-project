
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferencesValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];

  static validate(preferences: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push(`Invalid theme selection: ${preferences.theme}`);
    }

    if (typeof preferences.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!PreferencesValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Unsupported language: ${preferences.language}`);
    }

    if (preferences.fontSize < PreferencesValidator.MIN_FONT_SIZE || 
        preferences.fontSize > PreferencesValidator.MAX_FONT_SIZE) {
      errors.push(`Font size must be between ${PreferencesValidator.MIN_FONT_SIZE} and ${PreferencesValidator.MAX_FONT_SIZE}`);
    }

    return errors;
  }

  static validateAndThrow(preferences: UserPreferences): void {
    const errors = this.validate(preferences);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }
}

export { UserPreferences, PreferencesValidator };