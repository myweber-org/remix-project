
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_ITEMS_PER_PAGE = 5;
  private static readonly MAX_ITEMS_PER_PAGE = 100;

  static validate(preferences: Partial<UserPreferences>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (preferences.theme !== undefined && !['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push(`Invalid theme value. Must be 'light', 'dark', or 'auto'.`);
    }

    if (preferences.language !== undefined && !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Unsupported language. Supported languages: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (preferences.itemsPerPage !== undefined) {
      if (typeof preferences.itemsPerPage !== 'number' || !Number.isInteger(preferences.itemsPerPage)) {
        errors.push('Items per page must be an integer.');
      } else if (preferences.itemsPerPage < this.MIN_ITEMS_PER_PAGE || preferences.itemsPerPage > this.MAX_ITEMS_PER_PAGE) {
        errors.push(`Items per page must be between ${this.MIN_ITEMS_PER_PAGE} and ${this.MAX_ITEMS_PER_PAGE}.`);
      }
    }

    if (preferences.notifications !== undefined && typeof preferences.notifications !== 'boolean') {
      errors.push('Notifications preference must be a boolean value.');
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
      itemsPerPage: 20
    };
  }
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  const validation = PreferenceValidator.validate(updates);
  if (!validation.isValid) {
    throw new Error(`Invalid preferences: ${validation.errors.join(' ')}`);
  }
  
  return { ...existing, ...updates };
}

export { UserPreferences, PreferenceValidator, mergePreferences };