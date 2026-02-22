import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  itemsPerPage: z.number().int().min(5).max(100),
});

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  itemsPerPage: 20,
};

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    console.warn('Invalid preferences provided, using defaults:', error);
    return DEFAULT_PREFERENCES;
  }
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...DEFAULT_PREFERENCES, ...existing, ...updates };
  return validatePreferences(merged);
}

export function isPreferencesValid(prefs: UserPreferences): boolean {
  return UserPreferencesSchema.safeParse(prefs).success;
}typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    timezone: string;
}

class PreferenceValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
    private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

    static validate(prefs: UserPreferences): string[] {
        const errors: string[] = [];

        if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
            errors.push(`Invalid theme value: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
        }

        if (typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value.');
        }

        if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
            errors.push(`Unsupported language: ${prefs.language}. Supported languages are: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}.`);
        }

        if (!PreferenceValidator.VALID_TIMEZONES.test(prefs.timezone)) {
            errors.push(`Invalid timezone format: ${prefs.timezone}. Must be in format 'Area/Location'.`);
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

function testValidation() {
    const validPrefs: UserPreferences = {
        theme: 'dark',
        notifications: true,
        language: 'en',
        timezone: 'America/New_York'
    };

    const invalidPrefs: UserPreferences = {
        theme: 'purple' as any,
        notifications: 'yes' as any,
        language: 'klingon',
        timezone: 'InvalidZone'
    };

    console.log('Valid prefs errors:', PreferenceValidator.validate(validPrefs));
    console.log('Invalid prefs errors:', PreferenceValidator.validate(invalidPrefs));

    try {
        PreferenceValidator.validateAndThrow(invalidPrefs);
    } catch (error) {
        console.error('Validation exception:', error.message);
    }
}

export { UserPreferences, PreferenceValidator, testValidation };
```import { z } from 'zod';

const UserPreferencesSchema = z.object({
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
  language: z.string().min(2).max(5).default('en')
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid preferences: ${error.errors.map(e => `${e.path}: ${e.message}`).join(', ')}`);
      }
      throw new Error('Unknown validation error');
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