import { z } from 'zod';

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
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: this.formatErrorMessage(err)
        }));
        throw new PreferencesValidationError('Invalid preferences configuration', formattedErrors);
      }
      throw error;
    }
  }

  private static formatErrorMessage(error: z.ZodIssue): string {
    const field = error.path.join('.');
    
    switch (error.code) {
      case 'invalid_type':
        return `Field '${field}' must be ${error.expected}, received ${error.received}`;
      case 'invalid_enum_value':
        return `Field '${field}' must be one of: ${error.options.join(', ')}`;
      case 'too_small':
        return `Field '${field}' must contain at least ${error.minimum} characters`;
      case 'too_big':
        return `Field '${field}' must contain at most ${error.maximum} characters`;
      default:
        return `Validation failed for field '${field}'`;
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

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      details: this.details
    };
  }
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = {
    ...existing,
    ...updates,
    notifications: {
      ...existing.notifications,
      ...updates.notifications
    },
    privacy: {
      ...existing.privacy,
      ...updates.privacy
    }
  };
  
  return PreferencesValidator.validate(merged);
}