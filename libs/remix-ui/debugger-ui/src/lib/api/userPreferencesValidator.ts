import { z } from 'zod';

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
}).strict();

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return userPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: this.getCustomErrorMessage(err)
        }));
        throw new PreferencesValidationError('Invalid preferences configuration', fieldErrors);
      }
      throw error;
    }
  }

  private static getCustomErrorMessage(error: z.ZodIssue): string {
    const { code, path } = error;
    
    switch (code) {
      case 'invalid_type':
        return `Field '${path.join('.')}' must be ${error.expected}`;
      case 'invalid_enum_value':
        return `Field '${path.join('.')}' must be one of: ${error.options.join(', ')}`;
      case 'too_small':
        return `Field '${path.join('.')}' must contain at least ${error.minimum} characters`;
      case 'too_big':
        return `Field '${path.join('.')}' must contain at most ${error.maximum} characters`;
      default:
        return `Validation failed for field '${path.join('.')}'`;
    }
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
}

export function createDefaultPreferences(): UserPreferences {
  return userPreferencesSchema.parse({});
}