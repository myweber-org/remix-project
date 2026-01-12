interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
}

class PreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MIN_FONT_SIZE = 8;
  private static readonly MAX_FONT_SIZE = 72;

  static validate(preferences: Partial<UserPreferences>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (preferences.theme !== undefined && !['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push(`Invalid theme: ${preferences.theme}. Must be 'light', 'dark', or 'auto'.`);
    }

    if (preferences.language !== undefined && !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Unsupported language: ${preferences.language}. Supported: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (preferences.fontSize !== undefined) {
      if (typeof preferences.fontSize !== 'number') {
        errors.push(`Font size must be a number, received: ${typeof preferences.fontSize}`);
      } else if (preferences.fontSize < this.MIN_FONT_SIZE || preferences.fontSize > this.MAX_FONT_SIZE) {
        errors.push(`Font size ${preferences.fontSize} is out of range (${this.MIN_FONT_SIZE}-${this.MAX_FONT_SIZE})`);
      }
    }

    if (preferences.notifications !== undefined && typeof preferences.notifications !== 'boolean') {
      errors.push(`Notifications must be boolean, received: ${typeof preferences.notifications}`);
    }

    if (preferences.autoSave !== undefined && typeof preferences.autoSave !== 'boolean') {
      errors.push(`Auto-save must be boolean, received: ${typeof preferences.autoSave}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 14,
      autoSave: true
    };
  }
}

function mergePreferences(current: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  const validation = PreferencesValidator.validate(updates);
  if (!validation.isValid) {
    throw new Error(`Invalid preferences: ${validation.errors.join('; ')}`);
  }
  return { ...current, ...updates };
}

export { UserPreferences, PreferencesValidator, mergePreferences };