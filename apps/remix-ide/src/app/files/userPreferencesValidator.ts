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

    throw new PreferenceValidationError(
      `Invalid theme: ${theme}. Must be 'light', 'dark', or 'auto'`
    );
  }

  private static validateNotifications(notifications?: boolean): boolean {
    if (notifications === undefined || notifications === null) {
      return true;
    }
    return Boolean(notifications);
  }

  private static validateLanguage(language?: string): string {
    if (!language) {
      return 'en';
    }

    if (this.SUPPORTED_LANGUAGES.includes(language)) {
      return language;
    }

    throw new PreferenceValidationError(
      `Unsupported language: ${language}. Supported languages: ${this.SUPPORTED_LANGUAGES.join(', ')}`
    );
  }

  private static validateFontSize(size?: number): number {
    if (!size || typeof size !== 'number') {
      return 16;
    }

    if (size < this.MIN_FONT_SIZE || size > this.MAX_FONT_SIZE) {
      throw new PreferenceValidationError(
        `Font size ${size} out of range. Must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`
      );
    }

    return Math.round(size);
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };