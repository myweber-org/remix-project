interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MIN_FONT_SIZE = 8;
  private static readonly MAX_FONT_SIZE = 72;

  static validate(prefs: Partial<UserPreferences>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (prefs.theme !== undefined && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'`);
    }

    if (prefs.language !== undefined && !this.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}`);
    }

    if (prefs.fontSize !== undefined) {
      if (typeof prefs.fontSize !== 'number' || isNaN(prefs.fontSize)) {
        errors.push('Font size must be a valid number');
      } else if (prefs.fontSize < this.MIN_FONT_SIZE || prefs.fontSize > this.MAX_FONT_SIZE) {
        errors.push(`Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`);
      }
    }

    if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static sanitize(prefs: Partial<UserPreferences>): UserPreferences {
    const defaults: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16
    };

    const validated = this.validate(prefs);
    if (!validated.valid) {
      console.warn('Invalid preferences detected, using defaults for invalid fields:', validated.errors);
    }

    return {
      theme: this.isValidTheme(prefs.theme) ? prefs.theme : defaults.theme,
      notifications: typeof prefs.notifications === 'boolean' ? prefs.notifications : defaults.notifications,
      language: this.SUPPORTED_LANGUAGES.includes(prefs.language || '') ? prefs.language! : defaults.language,
      fontSize: this.isValidFontSize(prefs.fontSize) ? prefs.fontSize! : defaults.fontSize
    };
  }

  private static isValidTheme(theme: any): theme is UserPreferences['theme'] {
    return ['light', 'dark', 'auto'].includes(theme);
  }

  private static isValidFontSize(size: any): boolean {
    return typeof size === 'number' && 
           !isNaN(size) && 
           size >= this.MIN_FONT_SIZE && 
           size <= this.MAX_FONT_SIZE;
  }
}

export { UserPreferences, PreferenceValidator };