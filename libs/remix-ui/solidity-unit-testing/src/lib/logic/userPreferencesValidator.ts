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
  })
}).strict();

export type UserPreferences = z.infer<typeof PreferenceSchema>;

export class PreferenceValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return PreferenceSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: this.formatErrorMessage(err.message, err.path)
        }));
        throw new PreferenceValidationError('Invalid preference configuration', fieldErrors);
      }
      throw error;
    }
  }

  private static formatErrorMessage(message: string, path: string[]): string {
    const fieldName = path[path.length - 1] || 'configuration';
    return `Preference validation failed for "${fieldName}": ${message.toLowerCase()}`;
  }
}

export class PreferenceValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Array<{ path: string; message: string }>
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