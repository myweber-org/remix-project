interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MAX_ITEMS_PER_PAGE = 100;

  static validate(preferences: Partial<UserPreferences>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (preferences.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
        errors.push(`Invalid theme: ${preferences.theme}`);
      }
    }

    if (preferences.notifications !== undefined) {
      if (typeof preferences.notifications !== 'boolean') {
        errors.push('Notifications must be a boolean value');
      }
    }

    if (preferences.language !== undefined) {
      if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
        errors.push(`Unsupported language: ${preferences.language}`);
      }
    }

    if (preferences.itemsPerPage !== undefined) {
      if (!Number.isInteger(preferences.itemsPerPage) || preferences.itemsPerPage <= 0) {
        errors.push('Items per page must be a positive integer');
      } else if (preferences.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
        errors.push(`Items per page cannot exceed ${PreferenceValidator.MAX_ITEMS_PER_PAGE}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateStrict(preferences: UserPreferences): void {
    const result = this.validate(preferences);
    if (!result.isValid) {
      throw new Error(`Invalid preferences: ${result.errors.join(', ')}`);
    }
  }
}

export { UserPreferences, PreferenceValidator };