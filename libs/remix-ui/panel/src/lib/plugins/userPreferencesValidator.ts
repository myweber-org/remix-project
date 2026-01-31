interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const errors: string[] = [];

    if (!preferences.theme || !['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push('Theme must be one of: light, dark, auto');
    }

    if (preferences.notifications === undefined) {
      errors.push('Notifications preference is required');
    }

    if (!preferences.language) {
      errors.push('Language is required');
    } else if (!this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (!preferences.timezone) {
      errors.push('Timezone is required');
    } else if (!this.VALID_TIMEZONES.test(preferences.timezone)) {
      errors.push('Timezone must be in format: Area/Location (e.g., America/New_York)');
    }

    if (errors.length > 0) {
      throw new PreferenceValidationError(`Validation failed:\n${errors.join('\n')}`);
    }

    return preferences as UserPreferences;
  }

  static sanitize(preferences: UserPreferences): UserPreferences {
    return {
      ...preferences,
      language: preferences.language.toLowerCase(),
      timezone: preferences.timezone.replace(/\s+/g, '_')
    };
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  twoFactorAuth: boolean;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: this.validateTheme(preferences.theme),
      notifications: this.validateNotifications(preferences.notifications),
      language: this.validateLanguage(preferences.language),
      fontSize: this.validateFontSize(preferences.fontSize),
      twoFactorAuth: this.validateTwoFactorAuth(preferences.twoFactorAuth)
    };

    return validated;
  }

  private static validateTheme(theme?: string): UserPreferences['theme'] {
    if (!theme) return 'auto';
    
    if (theme === 'light' || theme === 'dark' || theme === 'auto') {
      return theme;
    }
    
    throw new PreferenceValidationError(
      `Invalid theme: '${theme}'. Must be 'light', 'dark', or 'auto'`
    );
  }

  private static validateNotifications(notifications?: boolean): boolean {
    return notifications !== undefined ? notifications : true;
  }

  private static validateLanguage(language?: string): string {
    if (!language) return 'en';
    
    if (this.SUPPORTED_LANGUAGES.includes(language)) {
      return language;
    }
    
    throw new PreferenceValidationError(
      `Unsupported language: '${language}'. Supported: ${this.SUPPORTED_LANGUAGES.join(', ')}`
    );
  }

  private static validateFontSize(size?: number): number {
    if (size === undefined) return 16;
    
    if (typeof size !== 'number' || isNaN(size)) {
      throw new PreferenceValidationError('Font size must be a number');
    }
    
    if (size < this.MIN_FONT_SIZE || size > this.MAX_FONT_SIZE) {
      throw new PreferenceValidationError(
        `Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`
      );
    }
    
    return Math.round(size);
  }

  private static validateTwoFactorAuth(twoFactorAuth?: boolean): boolean {
    return twoFactorAuth !== undefined ? twoFactorAuth : false;
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };