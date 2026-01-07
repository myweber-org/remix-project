import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).max(5).default('en')
}).strict();

type UserPreferences = z.infer<typeof PreferenceSchema>;

export class PreferenceValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return PreferenceSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: this.formatErrorMessage(err)
        }));
        throw new PreferenceValidationError('Invalid preference configuration', fieldErrors);
      }
      throw error;
    }
  }

  private static formatErrorMessage(error: z.ZodIssue): string {
    const { code, path } = error;
    const field = path.join('.');

    switch (code) {
      case 'invalid_type':
        return `Field "${field}" must be ${error.expected}, received ${error.received}`;
      case 'invalid_enum_value':
        return `Field "${field}" must be one of: ${error.options.join(', ')}`;
      case 'too_small':
        return `Field "${field}" must contain at least ${error.minimum} character(s)`;
      case 'too_big':
        return `Field "${field}" must contain at most ${error.maximum} character(s)`;
      default:
        return `Validation failed for field "${field}"`;
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return PreferenceSchema.parse({});
  }
}

export class PreferenceValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'PreferenceValidationError';
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      details: this.details
    };
  }
}