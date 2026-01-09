import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  fontSize: z.number().min(12).max(24)
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

  static sanitize(preferences: Partial<UserPreferences>): UserPreferences {
    const defaults: UserPreferences = {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16
    };

    return UserPreferencesSchema.parse({
      ...defaults,
      ...preferences
    });
  }
}

export function validatePreferencesUpdate(
  current: UserPreferences,
  update: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...current, ...update };
  const validated = PreferencesValidator.validate(merged);
  
  if (update.fontSize && (update.fontSize < 12 || update.fontSize > 24)) {
    throw new Error('Font size must be between 12 and 24');
  }

  return validated;
}