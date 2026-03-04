typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

class PreferenceValidator {
    private static readonly MIN_FONT_SIZE = 12;
    private static readonly MAX_FONT_SIZE = 24;
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];

    static validate(preferences: Partial<UserPreferences>): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (preferences.theme !== undefined && !['light', 'dark', 'auto'].includes(preferences.theme)) {
            errors.push(`Invalid theme: ${preferences.theme}`);
        }

        if (preferences.fontSize !== undefined) {
            if (typeof preferences.fontSize !== 'number') {
                errors.push('Font size must be a number');
            } else if (preferences.fontSize < this.MIN_FONT_SIZE || preferences.fontSize > this.MAX_FONT_SIZE) {
                errors.push(`Font size must be between ${this.MIN_FONT_SIZE} and ${this.MAX_FONT_SIZE}`);
            }
        }

        if (preferences.language !== undefined && !this.SUPPORTED_LANGUAGES.includes(preferences.language)) {
            errors.push(`Unsupported language: ${preferences.language}`);
        }

        if (preferences.notifications !== undefined && typeof preferences.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static getDefaultPreferences(): UserPreferences {
        return {
            theme: 'auto',
            notifications: true,
            language: 'en',
            fontSize: 16
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
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).max(5).default('en')
}).refine((data) => {
  return !(data.privacy.profileVisibility === 'private' && data.privacy.searchIndexing);
}, {
  message: 'Private profiles cannot be indexed by search engines',
  path: ['privacy.searchIndexing']
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  return userPreferencesSchema.parse(input);
}

export function sanitizeUserPreferences(input: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: {
      email: true,
      push: false,
      frequency: 'daily'
    },
    privacy: {
      profileVisibility: 'friends',
      searchIndexing: true
    },
    language: 'en'
  };
  
  return userPreferencesSchema.parse({ ...defaults, ...input });
}