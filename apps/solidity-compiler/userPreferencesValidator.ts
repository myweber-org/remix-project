
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
    const errors: string[] = [];

    if (!preferences.theme || !['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push('Theme must be either "light", "dark", or "auto"');
    }

    if (preferences.notifications === undefined || typeof preferences.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!preferences.language || !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Language must be one of: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (!preferences.timezone || !this.VALID_TIMEZONES.test(preferences.timezone)) {
      errors.push('Timezone must be in format "Area/Location" (e.g., "America/New_York")');
    }

    if (errors.length > 0) {
      throw new PreferenceValidationError(`Validation failed: ${errors.join('; ')}`);
    }

    return preferences as UserPreferences;
  }

  static sanitize(preferences: Partial<UserPreferences>): UserPreferences {
    return {
      theme: preferences.theme || 'auto',
      notifications: preferences.notifications ?? true,
      language: preferences.language || 'en',
      timezone: preferences.timezone || 'UTC'
    };
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };import { z } from 'zod';

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
  }),
  language: z.string().min(2).default('en')
}).strict();

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const validateUserPreferences = (input: unknown): UserPreferences => {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Invalid user preferences: ${errorMessages.join('; ')}`);
    }
    throw new Error('Unexpected validation error');
  }
};

export const getDefaultPreferences = (): UserPreferences => {
  return UserPreferencesSchema.parse({});
};