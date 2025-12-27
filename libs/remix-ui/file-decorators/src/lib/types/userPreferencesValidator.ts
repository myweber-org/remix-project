
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

  static validate(prefs: Partial<UserPreferences>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (prefs.theme !== undefined && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
    }

    if (prefs.language !== undefined && !PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (prefs.itemsPerPage !== undefined) {
      if (!Number.isInteger(prefs.itemsPerPage)) {
        errors.push('Items per page must be an integer.');
      } else if (prefs.itemsPerPage < PreferenceValidator.MIN_ITEMS_PER_PAGE || prefs.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
        errors.push(`Items per page must be between ${PreferenceValidator.MIN_ITEMS_PER_PAGE} and ${PreferenceValidator.MAX_ITEMS_PER_PAGE}.`);
      }
    }

    return {
      valid: errors.length === 0,
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

function mergePreferences(userInput: Partial<UserPreferences>, defaults: UserPreferences): UserPreferences {
  const validation = PreferenceValidator.validate(userInput);
  
  if (!validation.valid) {
    console.warn('Invalid preferences detected:', validation.errors);
  }

  return {
    theme: userInput.theme ?? defaults.theme,
    notifications: userInput.notifications ?? defaults.notifications,
    language: userInput.language ?? defaults.language,
    itemsPerPage: userInput.itemsPerPage ?? defaults.itemsPerPage
  };
}

export { UserPreferences, PreferenceValidator, mergePreferences };