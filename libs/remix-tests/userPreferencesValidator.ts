
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

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const errors: string[] = [];

    if (!preferences.theme || !['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push('Theme must be one of: light, dark, auto');
    }

    if (preferences.notifications === undefined) {
      errors.push('Notifications preference is required');
    }

    if (!preferences.language || !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (preferences.fontSize === undefined) {
      errors.push('Font size is required');
    } else if (preferences.fontSize < this.MIN_FONT_SIZE || preferences.fontSize > this.MAX_FONT_SIZE) {
      errors.push(`Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`);
    }

    if (errors.length > 0) {
      throw new PreferenceError(`Validation failed: ${errors.join('; ')}`, 'preferences');
    }

    return preferences as UserPreferences;
  }

  static validatePartial(preferences: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (preferences.theme && !['light', 'dark', 'auto'].includes(preferences.theme)) {
      throw new PreferenceError('Theme must be one of: light, dark, auto', 'theme');
    }
    if (preferences.theme) validated.theme = preferences.theme;

    if (preferences.notifications !== undefined) {
      validated.notifications = preferences.notifications;
    }

    if (preferences.language && !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      throw new PreferenceError(`Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`, 'language');
    }
    if (preferences.language) validated.language = preferences.language;

    if (preferences.fontSize !== undefined) {
      if (preferences.fontSize < this.MIN_FONT_SIZE || preferences.fontSize > this.MAX_FONT_SIZE) {
        throw new PreferenceError(`Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`, 'fontSize');
      }
      validated.fontSize = preferences.fontSize;
    }

    return validated;
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceError };