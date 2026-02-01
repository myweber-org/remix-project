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
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16,
      ...preferences
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceValidationError(
        `Invalid theme: ${validated.theme}. Must be 'light', 'dark', or 'auto'`
      );
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceValidationError(
        `Notifications must be a boolean value, received: ${typeof validated.notifications}`
      );
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceValidationError(
        `Unsupported language: ${validated.language}. Supported languages: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`
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

export { UserPreferencesValidator, PreferenceValidationError };
export type { UserPreferences };