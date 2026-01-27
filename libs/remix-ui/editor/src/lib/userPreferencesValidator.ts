
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferencesValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];

  static validate(prefs: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (prefs.theme !== undefined && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}`);
    }

    if (prefs.fontSize !== undefined) {
      if (typeof prefs.fontSize !== 'number') {
        errors.push('Font size must be a number');
      } else if (prefs.fontSize < this.MIN_FONT_SIZE || prefs.fontSize > this.MAX_FONT_SIZE) {
        errors.push(`Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`);
      }
    }

    if (prefs.language !== undefined && !this.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}`);
    }

    if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    return errors;
  }

  static sanitize(prefs: Partial<UserPreferences>): UserPreferences {
    const defaults: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16
    };

    const sanitized = { ...defaults, ...prefs };

    if (sanitized.fontSize < this.MIN_FONT_SIZE) sanitized.fontSize = this.MIN_FONT_SIZE;
    if (sanitized.fontSize > this.MAX_FONT_SIZE) sanitized.fontSize = this.MAX_FONT_SIZE;

    if (!this.SUPPORTED_LANGUAGES.includes(sanitized.language)) {
      sanitized.language = 'en';
    }

    return sanitized;
  }
}

export { UserPreferences, PreferencesValidator };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceError';
  }
}

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  const minFontSize = 12;
  const maxFontSize = 24;

  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceError(
      `Theme must be one of: ${validThemes.join(', ')}`,
      'theme'
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceError('Notifications must be a boolean value', 'notifications');
  }

  if (!validLanguages.includes(prefs.language)) {
    throw new PreferenceError(
      `Language must be one of: ${validLanguages.join(', ')}`,
      'language'
    );
  }

  if (prefs.fontSize < minFontSize || prefs.fontSize > maxFontSize) {
    throw new PreferenceError(
      `Font size must be between ${minFontSize} and ${maxFontSize}`,
      'fontSize'
    );
  }
}

function saveUserPreferences(prefs: UserPreferences): { success: boolean; errors?: PreferenceError[] } {
  const errors: PreferenceError[] = [];

  try {
    validateUserPreferences(prefs);
    return { success: true };
  } catch (error) {
    if (error instanceof PreferenceError) {
      errors.push(error);
    }
    return { success: false, errors };
  }
}

export { UserPreferences, PreferenceError, validateUserPreferences, saveUserPreferences };