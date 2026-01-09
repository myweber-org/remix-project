import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'system']);
const NotificationLevelSchema = z.enum(['none', 'essential', 'all']);

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    level: NotificationLevelSchema.default('essential')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  createdAt: z.date().default(() => new Date())
}).strict();

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: this.formatErrorMessage(err)
        }));
        throw new PreferencesValidationError('Invalid preferences configuration', fieldErrors);
      }
      throw error;
    }
  }

  private static formatErrorMessage(error: z.ZodIssue): string {
    switch (error.code) {
      case 'invalid_type':
        return `Expected ${error.expected}, received ${error.received}`;
      case 'invalid_enum_value':
        return `Invalid value. Allowed: ${error.options.join(', ')}`;
      case 'invalid_uuid':
        return 'Must be a valid UUID';
      default:
        return error.message;
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    return UserPreferencesSchema.partial().parse(updates);
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