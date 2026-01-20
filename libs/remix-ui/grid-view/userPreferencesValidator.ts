import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notificationsEnabled: z.boolean().default(true),
  itemsPerPage: z.number().int().min(5).max(100).default(20),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().optional(),
  emailFrequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        throw new ValidationError('Invalid preferences', formattedErrors);
      }
      throw error;
    }
  }

  static validatePartial(input: Partial<unknown>): Partial<UserPreferences> {
    return UserPreferencesSchema.partial().parse(input);
  }

  static getDefaultPreferences(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function sanitizePreferences(prefs: UserPreferences): UserPreferences {
  const sanitized = { ...prefs };
  
  if (sanitized.itemsPerPage > 50) {
    console.warn('Reducing itemsPerPage to maximum allowed value');
    sanitized.itemsPerPage = 50;
  }
  
  if (!sanitized.timezone) {
    sanitized.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  
  return sanitized;
}