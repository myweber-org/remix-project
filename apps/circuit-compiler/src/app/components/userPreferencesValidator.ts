import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean()
  }),
  language: z.string().min(2).max(5),
  timezone: z.string(),
  resultsPerPage: z.number().min(5).max(100).default(20)
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(data: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Invalid preferences: ${errorMessages.join(', ')}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(): UserPreferences {
  return {
    theme: 'auto',
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    language: 'en',
    timezone: 'UTC',
    resultsPerPage: 20
  };
}import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
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
        field: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Invalid preferences: ${JSON.stringify(formattedErrors)}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(): UserPreferences {
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
  twoFactorAuth: boolean;
}

class PreferencesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferencesError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: this.validateTheme(preferences.theme),
      notifications: this.validateBoolean(preferences.notifications, 'notifications'),
      language: this.validateLanguage(preferences.language),
      fontSize: this.validateFontSize(preferences.fontSize),
      twoFactorAuth: this.validateBoolean(preferences.twoFactorAuth, 'twoFactorAuth')
    };

    return validated;
  }

  private static validateTheme(theme?: string): UserPreferences['theme'] {
    if (!theme) return 'auto';
    
    if (theme === 'light' || theme === 'dark' || theme === 'auto') {
      return theme;
    }
    
    throw new PreferencesError(`Invalid theme: ${theme}. Must be 'light', 'dark', or 'auto'`);
  }

  private static validateBoolean(value: unknown, fieldName: string): boolean {
    if (typeof value === 'boolean') return value;
    if (value === undefined) return false;
    
    throw new PreferencesError(`Field '${fieldName}' must be a boolean value`);
  }

  private static validateLanguage(language?: string): string {
    if (!language) return 'en';
    
    if (this.SUPPORTED_LANGUAGES.includes(language)) {
      return language;
    }
    
    throw new PreferencesError(
      `Unsupported language: ${language}. Supported: ${this.SUPPORTED_LANGUAGES.join(', ')}`
    );
  }

  private static validateFontSize(size?: number): number {
    if (size === undefined) return 16;
    
    if (typeof size !== 'number' || !Number.isInteger(size)) {
      throw new PreferencesError('Font size must be an integer');
    }
    
    if (size < this.MIN_FONT_SIZE || size > this.MAX_FONT_SIZE) {
      throw new PreferencesError(
        `Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`
      );
    }
    
    return size;
  }
}

export { UserPreferencesValidator, UserPreferences, PreferencesError };