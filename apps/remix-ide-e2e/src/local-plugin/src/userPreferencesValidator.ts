import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).max(5).default('en')
}).strict();

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Invalid preferences: ${JSON.stringify(formattedErrors)}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validateUserPreferences(merged);
}interface UserPreferences {
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
      throw new PreferenceError('Theme is required', 'theme');
    }

    if (theme !== 'light' && theme !== 'dark' && theme !== 'auto') {
      throw new PreferenceError(
        `Theme must be one of: light, dark, auto. Received: ${theme}`,
        'theme'
      );
    }

    return theme as UserPreferences['theme'];
  }

  private static validateNotifications(notifications?: boolean): boolean {
    if (notifications === undefined || notifications === null) {
      throw new PreferenceError('Notifications preference is required', 'notifications');
    }

    return notifications;
  }

  private static validateLanguage(language?: string): string {
    if (!language) {
      throw new PreferenceError('Language is required', 'language');
    }

    if (!this.SUPPORTED_LANGUAGES.includes(language)) {
      throw new PreferenceError(
        `Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}. Received: ${language}`,
        'language'
      );
    }

    return language;
  }

  private static validateFontSize(fontSize?: number): number {
    if (fontSize === undefined || fontSize === null) {
      throw new PreferenceError('Font size is required', 'fontSize');
    }

    if (!Number.isInteger(fontSize)) {
      throw new PreferenceError('Font size must be an integer', 'fontSize');
    }

    if (fontSize < this.MIN_FONT_SIZE || fontSize > this.MAX_FONT_SIZE) {
      throw new PreferenceError(
        `Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}. Received: ${fontSize}`,
        'fontSize'
      );
    }

    return fontSize;
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceError };