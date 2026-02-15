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

  private static validateTheme(theme?: string): 'light' | 'dark' | 'auto' {
    if (!theme) {
      throw new PreferenceError('Theme is required', 'theme');
    }

    if (theme !== 'light' && theme !== 'dark' && theme !== 'auto') {
      throw new PreferenceError(
        `Theme must be 'light', 'dark', or 'auto'`,
        'theme'
      );
    }

    return theme;
  }

  private static validateNotifications(notifications?: boolean): boolean {
    if (notifications === undefined) {
      throw new PreferenceError('Notifications setting is required', 'notifications');
    }

    return notifications;
  }

  private static validateLanguage(language?: string): string {
    if (!language) {
      throw new PreferenceError('Language is required', 'language');
    }

    if (!this.SUPPORTED_LANGUAGES.includes(language)) {
      throw new PreferenceError(
        `Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`,
        'language'
      );
    }

    return language;
  }

  private static validateFontSize(fontSize?: number): number {
    if (fontSize === undefined) {
      throw new PreferenceError('Font size is required', 'fontSize');
    }

    if (!Number.isInteger(fontSize)) {
      throw new PreferenceError('Font size must be an integer', 'fontSize');
    }

    if (fontSize < this.MIN_FONT_SIZE || fontSize > this.MAX_FONT_SIZE) {
      throw new PreferenceError(
        `Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`,
        'fontSize'
      );
    }

    return fontSize;
  }
}

export { UserPreferencesValidator, PreferenceError, UserPreferences };import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({}),
  updatedAt: z.date().optional()
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid preferences: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  static getDefaults(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }

  static mergeWithDefaults(partial: Partial<UserPreferences>): UserPreferences {
    const defaults = this.getDefaults();
    return this.validate({ ...defaults, ...partial });
  }
}

export function sanitizePreferencesForAPI(prefs: UserPreferences): Omit<UserPreferences, 'updatedAt'> {
  const { updatedAt, ...sanitized } = prefs;
  return sanitized;
}