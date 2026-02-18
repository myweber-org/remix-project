import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notificationsEnabled: z.boolean().default(true),
  itemsPerPage: z.number().min(5).max(100).default(25),
  language: z.string().length(2).default('en'),
  timezone: z.string().optional(),
  autoSaveInterval: z.number().positive().optional(),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        throw new ValidationError('Invalid user preferences', issues);
      }
      throw error;
    }
  }

  static validatePartial(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const schema = UserPreferencesSchema.partial();
    return schema.parse(updates);
  }

  static getDefaults(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function sanitizePreferences(prefs: UserPreferences): UserPreferences {
  return {
    ...prefs,
    language: prefs.language.toLowerCase(),
    timezone: prefs.timezone?.replace(/\s+/g, '_'),
  };
}