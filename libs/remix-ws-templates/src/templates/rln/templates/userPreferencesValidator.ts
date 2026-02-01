import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'system']);
const NotificationLevelSchema = z.enum(['none', 'essential', 'all']);

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    level: NotificationLevelSchema.default('essential')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  createdAt: z.date().default(() => new Date())
}).strict();

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: this.formatErrorMessage(err)
        }));
        throw new PreferencesValidationError('Invalid preferences configuration', fieldErrors);
      }
      throw error;
    }
  }

  private static formatErrorMessage(error: z.ZodIssue): string {
    switch (error.code) {
      case 'invalid_type':
        return `Expected ${error.expected}, received ${error.received}`;
      case 'invalid_enum_value':
        return `Invalid value. Allowed: ${error.options.join(', ')}`;
      case 'invalid_uuid':
        return 'Must be a valid UUID';
      default:
        return error.message;
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    return UserPreferencesSchema.partial().parse(updates);
  }
}

export class PreferencesValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'PreferencesValidationError';
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      details: this.details
    };
  }
}
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      timezone: 'UTC',
      ...preferences
    };

    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      throw new PreferenceValidationError(
        `Invalid theme '${validated.theme}'. Must be 'light', 'dark', or 'auto'.`
      );
    }

    if (typeof validated.notifications !== 'boolean') {
      throw new PreferenceValidationError(
        `Notifications must be a boolean value, received ${typeof validated.notifications}.`
      );
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(validated.language)) {
      throw new PreferenceValidationError(
        `Unsupported language '${validated.language}'. Supported languages: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}.`
      );
    }

    if (!UserPreferencesValidator.VALID_TIMEZONES.test(validated.timezone)) {
      throw new PreferenceValidationError(
        `Invalid timezone format '${validated.timezone}'. Expected format: 'Area/Location'.`
      );
    }

    return validated;
  }

  static sanitize(preferences: UserPreferences): UserPreferences {
    return {
      ...preferences,
      language: preferences.language.toLowerCase(),
      timezone: preferences.timezone.replace(/\s+/g, '_')
    };
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };