import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto'], {
    required_error: 'Theme selection is required',
    invalid_type_error: 'Theme must be light, dark, or auto'
  }),
  notifications: z.boolean({
    required_error: 'Notification preference is required'
  }),
  language: z.string()
    .min(2, 'Language code must be at least 2 characters')
    .max(5, 'Language code cannot exceed 5 characters')
    .regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid language code format'),
  resultsPerPage: z.number()
    .int('Results per page must be an integer')
    .min(5, 'Minimum 5 results per page')
    .max(100, 'Maximum 100 results per page')
    .default(20)
});

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Validation failed:\n${formattedErrors.join('\n')}`);
      }
      throw error;
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    return UserPreferencesSchema.partial().parse(updates);
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en-US',
      resultsPerPage: 20
    };
  }
}

export function mergePreferences(
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const validatedUpdates = PreferencesValidator.validatePartial(updates);
  return { ...existing, ...validatedUpdates };
}