typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme value: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value.');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}. Supported languages: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
      errors.push(`Font size must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}.`);
    }

    return errors;
  }

  static validateAndThrow(prefs: UserPreferences): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Validation failed:\n${errors.join('\n')}`);
    }
  }
}

function applyUserPreferences(prefs: UserPreferences): void {
  try {
    PreferenceValidator.validateAndThrow(prefs);
    console.log('Preferences applied successfully:', prefs);
  } catch (error) {
    console.error('Failed to apply preferences:', error.message);
  }
}

const validPreferences: UserPreferences = {
  theme: 'dark',
  notifications: true,
  language: 'en',
  fontSize: 16
};

const invalidPreferences: UserPreferences = {
  theme: 'red',
  notifications: 'yes' as any,
  language: 'zh',
  fontSize: 8
};

applyUserPreferences(validPreferences);
applyUserPreferences(invalidPreferences);
```interface UserPreferences {
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

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaultPreferences, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceValidationError(`Invalid theme: ${validated.theme}`);
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be boolean');
  }

  if (!validated.language || validated.language.trim().length === 0) {
    throw new PreferenceValidationError('Language cannot be empty');
  }

  if (validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceValidationError(`Font size ${validated.fontSize} out of range (8-72)`);
  }

  return validated;
}

function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  try {
    const validated = validateUserPreferences(prefs);
    console.log('Preferences saved:', validated);
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
      theme: this.validateTheme(preferences.theme),
      notifications: this.validateNotifications(preferences.notifications),
      language: this.validateLanguage(preferences.language),
      fontSize: this.validateFontSize(preferences.fontSize)
    };

    return validated;
  }

  private static validateTheme(theme?: string): UserPreferences['theme'] {
    if (!theme) {
      throw new PreferenceValidationError('Theme is required');
    }

    if (!['light', 'dark', 'auto'].includes(theme)) {
      throw new PreferenceValidationError(`Invalid theme: ${theme}. Must be 'light', 'dark', or 'auto'`);
    }

    return theme as UserPreferences['theme'];
  }

  private static validateNotifications(notifications?: boolean): boolean {
    if (notifications === undefined) {
      throw new PreferenceValidationError('Notifications preference is required');
    }

    return notifications;
  }

  private static validateLanguage(language?: string): string {
    if (!language) {
      throw new PreferenceValidationError('Language is required');
    }

    if (!this.SUPPORTED_LANGUAGES.includes(language)) {
      throw new PreferenceValidationError(
        `Unsupported language: ${language}. Supported languages: ${this.SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    return language;
  }

  private static validateFontSize(fontSize?: number): number {
    if (fontSize === undefined) {
      throw new PreferenceValidationError('Font size is required');
    }

    if (!Number.isInteger(fontSize)) {
      throw new PreferenceValidationError('Font size must be an integer');
    }

    if (fontSize < this.MIN_FONT_SIZE || fontSize > this.MAX_FONT_SIZE) {
      throw new PreferenceValidationError(
        `Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`
      );
    }

    return fontSize;
  }
}

export { UserPreferencesValidator, PreferenceValidationError, UserPreferences };