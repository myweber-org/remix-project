typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone?: string;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(prefs: Partial<UserPreferences>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (prefs.theme !== undefined && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}`);
    }

    if (prefs.language !== undefined && !this.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}`);
    }

    if (prefs.timezone !== undefined && !this.VALID_TIMEZONES.test(prefs.timezone)) {
      errors.push(`Invalid timezone format: ${prefs.timezone}`);
    }

    if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static normalize(prefs: Partial<UserPreferences>): UserPreferences {
    return {
      theme: prefs.theme ?? 'auto',
      notifications: prefs.notifications ?? true,
      language: prefs.language ?? 'en',
      timezone: prefs.timezone
    };
  }
}

export { UserPreferences, PreferenceValidator };
```import { z } from 'zod';

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({}),
  language: z.string().min(2).max(5).default('en')
}).refine(
  (data) => !(data.privacy.profileVisibility === 'public' && data.privacy.searchIndexing === false),
  {
    message: 'Public profiles must be searchable',
    path: ['privacy', 'searchIndexing']
  }
);

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return userPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Validation failed:\n${formattedErrors.join('\n')}`);
      }
      throw error;
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    return userPreferencesSchema.partial().parse(updates);
  }

  static getDefaults(): UserPreferences {
    return userPreferencesSchema.parse({});
  }
}