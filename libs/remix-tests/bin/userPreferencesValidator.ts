import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    dataSharing: z.boolean().default(false)
  }),
  language: z.string().min(2).max(5).default('en')
}).strict();

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: this.formatErrorMessage(err)
        }));
        throw new ValidationError('Invalid preferences configuration', formattedErrors);
      }
      throw error;
    }
  }

  private static formatErrorMessage(error: z.ZodIssue): string {
    switch (error.code) {
      case 'invalid_type':
        return `Expected ${error.expected}, received ${error.received}`;
      case 'invalid_enum_value':
        return `Invalid value. Allowed options: ${error.options.join(', ')}`;
      case 'too_small':
        return `Minimum length is ${error.minimum}`;
      case 'too_big':
        return `Maximum length is ${error.maximum}`;
      default:
        return error.message;
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export { PreferencesValidator, ValidationError, type UserPreferences };typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
    autoSave: boolean;
}

class PreferenceValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
    private static readonly MIN_FONT_SIZE = 8;
    private static readonly MAX_FONT_SIZE = 72;

    static validate(prefs: UserPreferences): string[] {
        const errors: string[] = [];

        if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
            errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
        }

        if (typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value.');
        }

        if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
            errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
        }

        if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
            errors.push(`Font size ${prefs.fontSize} out of range. Must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}.`);
        }

        if (typeof prefs.autoSave !== 'boolean') {
            errors.push('Auto-save must be a boolean value.');
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
    fontSize: 14,
    autoSave: true
};

const invalidPreferences: UserPreferences = {
    theme: 'purple',
    notifications: 'yes',
    language: 'klingon',
    fontSize: 200,
    autoSave: 'maybe'
};

applyUserPreferences(validPreferences);
applyUserPreferences(invalidPreferences);
```
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14
};

function validatePreferences(input: unknown): UserPreferences {
  if (!input || typeof input !== 'object') {
    return DEFAULT_PREFERENCES;
  }

  const partial = input as Partial<UserPreferences>;
  
  return {
    theme: isValidTheme(partial.theme) ? partial.theme : DEFAULT_PREFERENCES.theme,
    notifications: typeof partial.notifications === 'boolean' 
      ? partial.notifications 
      : DEFAULT_PREFERENCES.notifications,
    language: typeof partial.language === 'string' && partial.language.length === 2
      ? partial.language
      : DEFAULT_PREFERENCES.language,
    fontSize: typeof partial.fontSize === 'number' && partial.fontSize >= 8 && partial.fontSize <= 24
      ? partial.fontSize
      : DEFAULT_PREFERENCES.fontSize
  };
}

function isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
  return theme === 'light' || theme === 'dark' || theme === 'auto';
}

export function loadUserPreferences(storageKey: string): UserPreferences {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return DEFAULT_PREFERENCES;
    
    const parsed = JSON.parse(stored);
    return validatePreferences(parsed);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveUserPreferences(storageKey: string, preferences: Partial<UserPreferences>): void {
  const current = loadUserPreferences(storageKey);
  const merged = { ...current, ...preferences };
  const validated = validatePreferences(merged);
  
  localStorage.setItem(storageKey, JSON.stringify(validated));
}