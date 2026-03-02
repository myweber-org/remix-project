import { z } from 'zod';

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
        return `Value must be at least ${error.minimum} characters`;
      case 'too_big':
        return `Value must be at most ${error.maximum} characters`;
      default:
        return message;
    }
  }

  static getDefaultPreferences() {
    return PreferenceSchema.parse({});
  }
}

export type UserPreferences = z.infer<typeof PreferenceSchema>;import { z } from 'zod';

const UserPreferencesSchema = z.object({
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
}).strict();

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Invalid preferences: ${errorMessages.join('; ')}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validateUserPreferences(merged);
}