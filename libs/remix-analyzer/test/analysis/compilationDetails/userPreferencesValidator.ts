
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class UserPreferencesValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
  private static readonly VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  static validate(preferences: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(preferences.theme)) {
      errors.push(`Invalid theme selection: ${preferences.theme}`);
    }

    if (typeof preferences.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!UserPreferencesValidator.SUPPORTED_LANGUAGES.includes(preferences.language)) {
      errors.push(`Unsupported language: ${preferences.language}`);
    }

    if (!UserPreferencesValidator.VALID_TIMEZONES.test(preferences.timezone)) {
      errors.push(`Invalid timezone format: ${preferences.timezone}`);
    }

    return errors;
  }

  static validateAndThrow(preferences: UserPreferences): void {
    const errors = this.validate(preferences);
    if (errors.length > 0) {
      throw new Error(`Validation failed:\n${errors.join('\n')}`);
    }
  }
}

export { UserPreferences, UserPreferencesValidator };import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({}),
  language: z.string().min(2).max(5).default('en')
}).strict();

export class UserPreferencesValidator {
  static validate(input: unknown) {
    try {
      return { 
        success: true, 
        data: PreferenceSchema.parse(input),
        errors: null 
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: this.formatErrorMessage(err)
        }));
        return { 
          success: false, 
          data: null, 
          errors: formattedErrors 
        };
      }
      throw error;
    }
  }

  private static formatErrorMessage(error: z.ZodIssue): string {
    const { code, message } = error;
    
    switch (code) {
      case 'invalid_type':
        return `Expected ${error.expected}, received ${error.received}`;
      case 'invalid_enum_value':
        return `Invalid option. Allowed values: ${error.options.join(', ')}`;
      case 'too_small':
        return `Minimum length is ${error.minimum} characters`;
      case 'too_big':
        return `Maximum length is ${error.maximum} characters`;
      default:
        return message;
    }
  }

  static getDefaultPreferences() {
    return PreferenceSchema.parse({});
  }
}