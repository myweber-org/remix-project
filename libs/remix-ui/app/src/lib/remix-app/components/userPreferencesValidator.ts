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

  static validate(prefs: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: this.validateTheme(prefs.theme),
      notifications: this.validateNotifications(prefs.notifications),
      language: this.validateLanguage(prefs.language),
      fontSize: this.validateFontSize(prefs.fontSize)
    };

    return validated;
  }

  private static validateTheme(theme?: string): UserPreferences['theme'] {
    if (!theme) {
      throw new PreferenceError('Theme is required', 'theme');
    }

    if (theme !== 'light' && theme !== 'dark' && theme !== 'auto') {
      throw new PreferenceError(
        'Theme must be one of: light, dark, auto',
        'theme'
      );
    }

    return theme as UserPreferences['theme'];
  }

  private static validateNotifications(notifications?: boolean): boolean {
    if (notifications === undefined || notifications === null) {
      throw new PreferenceError('Notifications setting is required', 'notifications');
    }
    return notifications;
  }

  private static validateLanguage(language?: string): string {
    if (!language) {
      throw new PreferenceError('Language is required', 'language');
    }

    if (!this.SUPPORTED_LANGUAGES.includes(language)) {
      throw new PreferenceError(
        `Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`,
        'language'
      );
    }

    return language;
  }

  private static validateFontSize(size?: number): number {
    if (size === undefined || size === null) {
      throw new PreferenceError('Font size is required', 'fontSize');
    }

    if (!Number.isInteger(size)) {
      throw new PreferenceError('Font size must be an integer', 'fontSize');
    }

    if (size < this.MIN_FONT_SIZE || size > this.MAX_FONT_SIZE) {
      throw new PreferenceError(
        `Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`,
        'fontSize'
      );
    }

    return size;
  }
}

export { UserPreferencesValidator, PreferenceError, UserPreferences };