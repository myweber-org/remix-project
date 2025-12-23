interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidator {
  static validateTheme(theme: string): theme is UserPreferences['theme'] {
    return ['light', 'dark', 'auto'].includes(theme);
  }

  static validateFontSize(size: number): boolean {
    return Number.isInteger(size) && size >= 8 && size <= 32;
  }

  static validateLanguage(lang: string): boolean {
    const supportedLanguages = ['en', 'es', 'fr', 'de', 'ja'];
    return supportedLanguages.includes(lang.toLowerCase());
  }

  static validatePreferences(prefs: Partial<UserPreferences>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (prefs.theme !== undefined && !this.validateTheme(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}`);
    }

    if (prefs.fontSize !== undefined && !this.validateFontSize(prefs.fontSize)) {
      errors.push(`Font size must be between 8 and 32, got ${prefs.fontSize}`);
    }

    if (prefs.language !== undefined && !this.validateLanguage(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export { UserPreferences, PreferenceValidator };