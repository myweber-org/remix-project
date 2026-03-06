interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: this.validateTheme(preferences.theme),
      notifications: this.validateNotifications(preferences.notifications),
      language: this.validateLanguage(preferences.language),
      fontSize: this.validateFontSize(preferences.fontSize)
    };

    return validated;
  }

  private static validateTheme(theme?: string): 'light' | 'dark' | 'auto' {
    if (!theme) {
      return 'auto';
    }

    if (theme === 'light' || theme === 'dark' || theme === 'auto') {
      return theme;
    }

    throw new PreferenceError(`Invalid theme: ${theme}. Must be 'light', 'dark', or 'auto'.`);
  }

  private static validateNotifications(notifications?: boolean): boolean {
    if (notifications === undefined) {
      return true;
    }

    if (typeof notifications === 'boolean') {
      return notifications;
    }

    throw new PreferenceError('Notifications must be a boolean value.');
  }

  private static validateLanguage(language?: string): string {
    if (!language) {
      return 'en';
    }

    if (this.SUPPORTED_LANGUAGES.includes(language)) {
      return language;
    }

    throw new PreferenceError(
      `Unsupported language: ${language}. Supported languages: ${this.SUPPORTED_LANGUAGES.join(', ')}`
    );
  }

  private static validateFontSize(size?: number): number {
    if (!size) {
      return 16;
    }

    if (typeof size !== 'number' || isNaN(size)) {
      throw new PreferenceError('Font size must be a number.');
    }

    if (size < this.MIN_FONT_SIZE || size > this.MAX_FONT_SIZE) {
      throw new PreferenceError(
        `Font size ${size} is out of range. Must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}.`
      );
    }

    return Math.round(size);
  }
}

export { UserPreferencesValidator, PreferenceError, UserPreferences };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16,
      ...preferences
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceValidationError(
        `Invalid theme '${validated.theme}'. Must be one of: light, dark, auto`
      );
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceValidationError(
        `Notifications must be a boolean value, received: ${typeof validated.notifications}`
      );
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceValidationError(
        `Unsupported language '${validated.language}'. Supported: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    if (validated.fontSize < UserPreferencesValidator.MIN_FONT_SIZE || 
        validated.fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
      throw new PreferenceValidationError(
        `Font size ${validated.fontSize} is out of range. Must be between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}`
      );
    }

    return validated;
  }

  static validateAndLog(preferences: Partial<UserPreferences>): UserPreferences {
    try {
      const result = this.validate(preferences);
      console.log('Preferences validated successfully:', result);
      return result;
    } catch (error) {
      if (error instanceof PreferenceValidationError) {
        console.error('Validation failed:', error.message);
      }
      throw error;
    }
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };