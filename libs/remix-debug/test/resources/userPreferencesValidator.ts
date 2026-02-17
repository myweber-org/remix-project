
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
        `Invalid theme '${validated.theme}'. Must be 'light', 'dark', or 'auto'`
      );
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceValidationError('Notifications must be a boolean value');
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

  static validatePartialUpdate(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const result: Partial<UserPreferences> = {};

    if (updates.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(updates.theme)) {
        throw new PreferenceValidationError(
          `Invalid theme '${updates.theme}'. Must be 'light', 'dark', or 'auto'`
        );
      }
      result.theme = updates.theme;
    }

    if (updates.notifications !== undefined) {
      if (typeof updates.notifications !== 'boolean') {
        throw new PreferenceValidationError('Notifications must be a boolean value');
      }
      result.notifications = updates.notifications;
    }

    if (updates.language !== undefined) {
      if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(updates.language)) {
        throw new PreferenceValidationError(
          `Unsupported language '${updates.language}'. Supported: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`
        );
      }
      result.language = updates.language;
    }

    if (updates.fontSize !== undefined) {
      if (updates.fontSize < UserPreferencesValidator.MIN_FONT_SIZE || 
          updates.fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
        throw new PreferenceValidationError(
          `Font size ${updates.fontSize} is out of range. Must be between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}`
        );
      }
      result.fontSize = updates.fontSize;
    }

    return result;
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };