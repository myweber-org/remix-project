
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

  private static validateTheme(theme?: string): UserPreferences['theme'] {
    if (!theme) {
      throw new PreferenceValidationError('Theme is required');
    }

    if (theme !== 'light' && theme !== 'dark' && theme !== 'auto') {
      throw new PreferenceValidationError(
        `Theme must be one of: light, dark, auto. Received: ${theme}`
      );
    }

    return theme as UserPreferences['theme'];
  }

  private static validateNotifications(notifications?: boolean): boolean {
    if (notifications === undefined || notifications === null) {
      throw new PreferenceValidationError('Notifications preference is required');
    }

    return notifications;
  }

  private static validateLanguage(language?: string): string {
    if (!language) {
      throw new PreferenceValidationError('Language is required');
    }

    if (!this.SUPPORTED_LANGUAGES.includes(language)) {
      throw new PreferenceValidationError(
        `Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}. Received: ${language}`
      );
    }

    return language;
  }

  private static validateFontSize(fontSize?: number): number {
    if (fontSize === undefined || fontSize === null) {
      throw new PreferenceValidationError('Font size is required');
    }

    if (!Number.isInteger(fontSize)) {
      throw new PreferenceValidationError('Font size must be an integer');
    }

    if (fontSize < this.MIN_FONT_SIZE || fontSize > this.MAX_FONT_SIZE) {
      throw new PreferenceValidationError(
        `Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}. Received: ${fontSize}`
      );
    }

    return fontSize;
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 14,
  autoSave: true
};

const THEME_VALUES = ['light', 'dark', 'auto'] as const;

class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    if (!input || typeof input !== 'object') {
      return DEFAULT_PREFERENCES;
    }

    const partial = input as Partial<UserPreferences>;
    
    return {
      theme: this.validateTheme(partial.theme),
      notifications: this.validateBoolean(partial.notifications, DEFAULT_PREFERENCES.notifications),
      language: this.validateLanguage(partial.language),
      fontSize: this.validateFontSize(partial.fontSize),
      autoSave: this.validateBoolean(partial.autoSave, DEFAULT_PREFERENCES.autoSave)
    };
  }

  private static validateTheme(theme: unknown): UserPreferences['theme'] {
    if (typeof theme === 'string' && THEME_VALUES.includes(theme as any)) {
      return theme as UserPreferences['theme'];
    }
    return DEFAULT_PREFERENCES.theme;
  }

  private static validateBoolean(value: unknown, defaultValue: boolean): boolean {
    return typeof value === 'boolean' ? value : defaultValue;
  }

  private static validateLanguage(lang: unknown): string {
    if (typeof lang === 'string' && /^[a-z]{2}-[A-Z]{2}$/.test(lang)) {
      return lang;
    }
    return DEFAULT_PREFERENCES.language;
  }

  private static validateFontSize(size: unknown): number {
    if (typeof size === 'number' && size >= 8 && size <= 32) {
      return Math.round(size);
    }
    return DEFAULT_PREFERENCES.fontSize;
  }
}

export { UserPreferences, PreferencesValidator };