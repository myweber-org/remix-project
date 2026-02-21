
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
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16,
      ...preferences
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceError(
        `Theme must be one of: light, dark, auto. Received: ${validated.theme}`,
        'theme'
      );
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceError(
        `Notifications must be a boolean. Received: ${validated.notifications}`,
        'notifications'
      );
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceError(
        `Language must be one of: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}. Received: ${validated.language}`,
        'language'
      );
    }

    if (validated.fontSize < UserPreferencesValidator.MIN_FONT_SIZE || 
        validated.fontSize > UserPreferencesValidator.MAX_FONT_SIZE) {
      throw new PreferenceError(
        `Font size must be between ${UserPreferencesValidator.MIN_FONT_SIZE} and ${UserPreferencesValidator.MAX_FONT_SIZE}. Received: ${validated.fontSize}`,
        'fontSize'
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
      if (error instanceof PreferenceError) {
        console.error(`Validation failed for field "${error.field}": ${error.message}`);
      } else {
        console.error('Unknown validation error:', error);
      }
      throw error;
    }
  }
}

export { UserPreferencesValidator, PreferenceError, UserPreferences };import { z } from "zod";

const UserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(["immediate", "daily", "weekly"]).default("daily")
  }),
  privacy: z.object({
    profileVisibility: z.enum(["public", "friends", "private"]).default("friends"),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).max(5).default("en")
}).strict();

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid preferences: ${error.errors.map(e => `${e.path}: ${e.message}`).join(", ")}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}

export function mergePreferences(existing: Partial<UserPreferences>, updates: Partial<UserPreferences>): UserPreferences {
  const current = UserPreferencesSchema.partial().parse(existing);
  const merged = { ...current, ...updates };
  return validateUserPreferences(merged);
}