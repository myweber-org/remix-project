typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: string;
    itemsPerPage: number;
}

class PreferenceValidator {
    private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
    private static readonly MIN_ITEMS_PER_PAGE = 5;
    private static readonly MAX_ITEMS_PER_PAGE = 100;

    static validate(prefs: UserPreferences): string[] {
        const errors: string[] = [];

        if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
            errors.push(`Invalid theme value: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
        }

        if (typeof prefs.notifications !== 'boolean') {
            errors.push('Notifications must be a boolean value.');
        }

        if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
            errors.push(`Unsupported language: ${prefs.language}. Supported languages: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
        }

        if (!Number.isInteger(prefs.itemsPerPage) || prefs.itemsPerPage < PreferenceValidator.MIN_ITEMS_PER_PAGE || prefs.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
            errors.push(`Items per page must be an integer between ${PreferenceValidator.MIN_ITEMS_PER_PAGE} and ${PreferenceValidator.MAX_ITEMS_PER_PAGE}.`);
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
    itemsPerPage: 20
};

const invalidPreferences: UserPreferences = {
    theme: 'blue',
    notifications: 'yes',
    language: 'zh',
    itemsPerPage: 150
};

processUserPreferences(validPreferences);
processUserPreferences(invalidPreferences);
```import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  fontSize: z.number().min(12).max(24).default(16),
  language: z.string().length(2).default('en'),
  autoSave: z.boolean().default(false),
  twoFactorAuth: z.boolean().default(false)
});

export type UserPreferences = z.infer<typeof PreferenceSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return PreferenceSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Invalid preferences: ${errorMessages.join('; ')}`);
      }
      throw new Error('Unexpected validation error');
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    try {
      return PreferenceSchema.partial().parse(updates);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Invalid preference updates: ${errorMessages.join('; ')}`);
      }
      throw new Error('Unexpected validation error');
    }
  }
}