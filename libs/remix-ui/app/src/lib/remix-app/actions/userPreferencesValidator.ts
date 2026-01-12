import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  resultsPerPage: z.number().min(5).max(100).default(20),
  language: z.string().length(2).default('en')
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Invalid preferences: ${errorMessages.join('; ')}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    fontSize: number;
}

class PreferenceValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
    private static readonly MIN_FONT_SIZE = 8;
    private static readonly MAX_FONT_SIZE = 72;

    static validate(prefs: UserPreferences): string[] {
        const errors: string[] = [];

        if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
            errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
        }

        if (typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value.');
        }

        if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
            errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
        }

        if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
            errors.push(`Font size ${prefs.fontSize} is out of range. Must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}.`);
        }

        if (!Number.isInteger(prefs.fontSize)) {
            errors.push('Font size must be an integer value.');
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

function processUserPreferences(prefs: UserPreferences): void {
    try {
        PreferenceValidator.validateAndThrow(prefs);
        console.log('Preferences validated successfully:', prefs);
    } catch (error) {
        console.error('Failed to process preferences:', error.message);
    }
}

const validPreferences: UserPreferences = {
    theme: 'dark',
    notifications: true,
    language: 'en',
    fontSize: 14
};

const invalidPreferences: UserPreferences = {
    theme: 'blue' as any,
    notifications: 'yes' as any,
    language: 'zh',
    fontSize: 100
};

processUserPreferences(validPreferences);
processUserPreferences(invalidPreferences);
```