import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    dataSharing: z.boolean().default(false)
  }).optional()
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed:', error.errors);
      throw new Error('Invalid preferences configuration');
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return PreferenceSchema.parse({});
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const current = PreferenceSchema.partial().parse(existing);
  const merged = { ...current, ...updates };
  return validatePreferences(merged);
}interface UserPreferences {
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

  static validate(preferences: UserPreferences): void {
    if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
      throw new PreferenceValidationError(
        'Theme must be one of: light, dark, auto'
      );
    }

    if (typeof preferences.notifications !== 'boolean') {
      throw new PreferenceValidationError('Notifications must be a boolean value');
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      throw new PreferenceValidationError(
        `Language must be one of: ${UserPreferencesValidator.SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    if (!UserPreferencesValidator.VALID_TIMEZONES.test(preferences.timezone)) {
      throw new PreferenceValidationError(
        'Timezone must be in format: Area/Location (e.g., America/New_York)'
      );
    }
  }

  static validatePartial(updates: Partial<UserPreferences>): void {
    const defaultPreferences: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      timezone: 'UTC'
    };

    const mergedPreferences = { ...defaultPreferences, ...updates };
    this.validate(mergedPreferences);
  }
}

export { UserPreferences, UserPreferencesValidator, PreferenceValidationError };