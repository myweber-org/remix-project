interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_FONT_SIZE = 8;
  private static readonly MAX_FONT_SIZE = 72;

  static validate(preferences: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (preferences.theme !== undefined) {
      if (!['light', 'dark'].includes(preferences.theme)) {
        errors.push('Theme must be either "light" or "dark"');
      }
    }

    if (preferences.notifications !== undefined) {
      if (typeof preferences.notifications !== 'boolean') {
        errors.push('Notifications must be a boolean value');
      }
    }

    if (preferences.language !== undefined) {
      if (typeof preferences.language !== 'string') {
        errors.push('Language must be a string');
      } else if (!this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
        errors.push(`Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
      }
    }

    if (preferences.fontSize !== undefined) {
      if (typeof preferences.fontSize !== 'number') {
        errors.push('Font size must be a number');
      } else if (preferences.fontSize < this.MIN_FONT_SIZE || preferences.fontSize > this.MAX_FONT_SIZE) {
        errors.push(`Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`);
      }
    }

    return errors;
  }

  static validateAndThrow(preferences: Partial<UserPreferences>): void {
    const errors = this.validate(preferences);
    if (errors.length > 0) {
      throw new Error(`Invalid preferences: ${errors.join('; ')}`);
    }
  }
}

export { UserPreferences, UserPreferencesValidator };