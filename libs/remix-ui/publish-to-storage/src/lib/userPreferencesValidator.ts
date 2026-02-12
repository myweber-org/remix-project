
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value.');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
      errors.push(`Font size ${prefs.fontSize} is out of range. Must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}.`);
    }

    return errors;
  }
}

export { UserPreferences, PreferenceValidator };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
  itemsPerPage: number;
}

class PreferenceValidationError extends Error {
  constructor(
    public field: string,
    public value: unknown,
    public reason: string
  ) {
    super(`Invalid preference value for ${field}: ${value} - ${reason}`);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: this.validateTheme(preferences.theme),
      notifications: this.validateNotifications(preferences.notifications),
      language: this.validateLanguage(preferences.language),
      timezone: this.validateTimezone(preferences.timezone),
      itemsPerPage: this.validateItemsPerPage(preferences.itemsPerPage),
    };

    return validated;
  }

  private static validateTheme(theme?: unknown): UserPreferences['theme'] {
    if (theme === undefined) return 'auto';
    
    if (typeof theme !== 'string') {
      throw new PreferenceValidationError('theme', theme, 'must be a string');
    }

    if (!['light', 'dark', 'auto'].includes(theme)) {
      throw new PreferenceValidationError('theme', theme, 'must be one of: light, dark, auto');
    }

    return theme as UserPreferences['theme'];
  }

  private static validateNotifications(notifications?: unknown): boolean {
    if (notifications === undefined) return true;
    
    if (typeof notifications !== 'boolean') {
      throw new PreferenceValidationError('notifications', notifications, 'must be a boolean');
    }

    return notifications;
  }

  private static validateLanguage(language?: unknown): string {
    if (language === undefined) return 'en';
    
    if (typeof language !== 'string') {
      throw new PreferenceValidationError('language', language, 'must be a string');
    }

    if (!this.SUPPORTED_LANGUAGES.includes(language)) {
      throw new PreferenceValidationError('language', language, `must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    return language;
  }

  private static validateTimezone(timezone?: unknown): string {
    if (timezone === undefined) return 'UTC';
    
    if (typeof timezone !== 'string') {
      throw new PreferenceValidationError('timezone', timezone, 'must be a string');
    }

    if (!this.VALID_TIMEZONES.test(timezone)) {
      throw new PreferenceValidationError('timezone', timezone, 'must be in format: Area/Location');
    }

    return timezone;
  }

  private static validateItemsPerPage(itemsPerPage?: unknown): number {
    if (itemsPerPage === undefined) return 25;
    
    if (typeof itemsPerPage !== 'number') {
      throw new PreferenceValidationError('itemsPerPage', itemsPerPage, 'must be a number');
    }

    if (!Number.isInteger(itemsPerPage) || itemsPerPage < 1 || itemsPerPage > 100) {
      throw new PreferenceValidationError('itemsPerPage', itemsPerPage, 'must be an integer between 1 and 100');
    }

    return itemsPerPage;
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };