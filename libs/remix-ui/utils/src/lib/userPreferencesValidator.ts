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
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16,
      ...preferences
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceValidationError(
        `Invalid theme: ${validated.theme}. Must be 'light', 'dark', or 'auto'`
      );
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceValidationError(
        `Notifications must be a boolean value, received: ${typeof validated.notifications}`
      );
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceValidationError(
        `Unsupported language: ${validated.language}. Supported languages: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    if (validated.fontSize < UserPreferencesValidator.MIN_FONT_SIZE || 
        validated.fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
      throw new PreferenceValidationError(
        `Font size ${validated.fontSize} is out of range. Must be between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}`
      );
    }

    return validated;
  }

  static validateAndLog(preferences: Partial<UserPreferences>): UserPreferences {
    try {
      const result = this.validate(preferences);
      console.log('Preferences validated successfully:', result);
      return result;
    } catch (error) {
      if (error instanceof PreferenceValidationError) {
        console.error('Validation failed:', error.message);
      }
      throw error;
    }
  }
}

export { UserPreferencesValidator, PreferenceValidationError };
export type { UserPreferences };import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    dataSharing: z.boolean().default(false)
  }),
  language: z.string().min(2).max(5).default('en')
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Invalid preferences: ${errorMessages.join('; ')}`);
      }
      throw error;
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }

  static mergePreferences(
    existing: Partial<UserPreferences>,
    updates: Partial<UserPreferences>
  ): UserPreferences {
    const merged = { ...existing, ...updates };
    return this.validate(merged);
  }
}

export function createPreferencesGuard() {
  let preferences: UserPreferences = PreferencesValidator.getDefaultPreferences();

  return {
    get current(): UserPreferences {
      return { ...preferences };
    },

    update(newPreferences: Partial<UserPreferences>): UserPreferences {
      preferences = PreferencesValidator.mergePreferences(preferences, newPreferences);
      return this.current;
    },

    reset(): void {
      preferences = PreferencesValidator.getDefaultPreferences();
    },

    isValid(input: unknown): boolean {
      try {
        PreferencesValidator.validate(input);
        return true;
      } catch {
        return false;
      }
    }
  };
}