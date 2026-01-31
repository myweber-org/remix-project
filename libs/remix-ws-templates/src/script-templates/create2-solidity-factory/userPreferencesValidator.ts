
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MIN_ITEMS_PER_PAGE = 5;
  private static readonly MAX_ITEMS_PER_PAGE = 100;

  static validate(preferences: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (preferences.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
        errors.push(`Theme must be one of: light, dark, auto. Received: ${preferences.theme}`);
      }
    }

    if (preferences.language !== undefined) {
      if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
        errors.push(`Language must be one of: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}. Received: ${preferences.language}`);
      }
    }

    if (preferences.itemsPerPage !== undefined) {
      if (!Number.isInteger(preferences.itemsPerPage)) {
        errors.push(`Items per page must be an integer. Received: ${preferences.itemsPerPage}`);
      } else if (preferences.itemsPerPage < UserPreferencesValidator.MIN_ITEMS_PER_PAGE || 
                 preferences.itemsPerPage > UserPreferencesValidator.MAX_ITEMS_PER_PAGE) {
        errors.push(`Items per page must be between ${UserPreferencesValidator.MIN_ITEMS_PER_PAGE} and ${UserPreferencesValidator.MAX_ITEMS_PER_PAGE}. Received: ${preferences.itemsPerPage}`);
      }
    }

    if (preferences.notifications !== undefined) {
      if (typeof preferences.notifications !== 'boolean') {
        errors.push(`Notifications must be a boolean value. Received: ${preferences.notifications}`);
      }
    }

    return errors;
  }

  static validateAndThrow(preferences: Partial<UserPreferences>): void {
    const errors = this.validate(preferences);
    if (errors.length > 0) {
      throw new Error(`Invalid user preferences:\n${errors.join('\n')}`);
    }
  }
}

export { UserPreferences, UserPreferencesValidator };