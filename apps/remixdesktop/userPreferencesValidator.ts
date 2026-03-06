
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

function validateUserPreferences(prefs: unknown): UserPreferences {
  if (typeof prefs !== 'object' || prefs === null) {
    throw new PreferenceValidationError('Preferences must be an object');
  }

  const preferences = prefs as Record<string, unknown>;
  
  if (!['light', 'dark', 'auto'].includes(preferences.theme as string)) {
    throw new PreferenceValidationError('Theme must be light, dark, or auto');
  }

  if (typeof preferences.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }

  if (typeof preferences.language !== 'string' || preferences.language.length === 0) {
    throw new PreferenceValidationError('Language must be a non-empty string');
  }

  const itemsPerPage = Number(preferences.itemsPerPage);
  if (!Number.isInteger(itemsPerPage) || itemsPerPage < 5 || itemsPerPage > 100) {
    throw new PreferenceValidationError('Items per page must be an integer between 5 and 100');
  }

  return {
    theme: preferences.theme as 'light' | 'dark' | 'auto',
    notifications: preferences.notifications as boolean,
    language: preferences.language as string,
    itemsPerPage: itemsPerPage
  };
}

function saveUserPreferences(prefs: unknown): void {
  try {
    const validatedPrefs = validateUserPreferences(prefs);
    console.log('Saving validated preferences:', validatedPrefs);
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error('Validation failed:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  fontSize: number;
  language: string;
}

class PreferenceValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];

  static validate(prefs: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (prefs.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
        errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
      }
    }

    if (prefs.fontSize !== undefined) {
      if (typeof prefs.fontSize !== 'number') {
        errors.push('Font size must be a number.');
      } else if (prefs.fontSize < this.MIN_FONT_SIZE || prefs.fontSize > this.MAX_FONT_SIZE) {
        errors.push(`Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}.`);
      }
    }

    if (prefs.language !== undefined) {
      if (!this.SUPPORTED_LANGUAGES.includes(prefs.language)) {
        errors.push(`Unsupported language: ${prefs.language}. Supported: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
      }
    }

    if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications preference must be a boolean value.');
    }

    return errors;
  }

  static validateAndThrow(prefs: Partial<UserPreferences>): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Validation failed:\n${errors.join('\n')}`);
    }
  }
}

export { UserPreferences, PreferenceValidator };