
import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
}

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  fontSize: z.number().min(8).max(72),
  autoSave: z.boolean(),
});

export class PreferencesValidator {
  static validate(preferences: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(preferences);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Invalid preferences: ${errorMessages.join(', ')}`);
      }
      throw error;
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 14,
      autoSave: true,
    };
  }

  static mergeWithDefaults(partialPreferences: Partial<UserPreferences>): UserPreferences {
    const defaults = this.getDefaultPreferences();
    return { ...defaults, ...partialPreferences };
  }
}

export function validateAndNormalizePreferences(
  input: unknown
): { valid: boolean; data?: UserPreferences; errors?: string[] } {
  try {
    const validated = UserPreferencesSchema.parse(input);
    return { valid: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message);
      return { valid: false, errors };
    }
    return { valid: false, errors: ['Unknown validation error'] };
  }
}