
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

    if (preferences.notifications === undefined || typeof preferences.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!preferences.language || !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (preferences.fontSize === undefined || 
        typeof preferences.fontSize !== 'number' ||
        preferences.fontSize < this.MIN_FONT_SIZE ||
        preferences.fontSize > this.MAX_FONT_SIZE) {
      errors.push(`Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`);
    }

    if (errors.length > 0) {
      throw new PreferenceError(`Validation failed: ${errors.join('; ')}`, 'preferences');
    }

    return preferences as UserPreferences;
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceError };