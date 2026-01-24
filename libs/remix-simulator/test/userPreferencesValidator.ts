import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  autoSave: boolean;
}

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(10),
  fontSize: z.number().min(8).max(72),
  autoSave: z.boolean(),
});

export class UserPreferencesValidator {
  static validate(data: unknown): UserPreferences {
    try {
      return userPreferencesSchema.parse(data) as UserPreferences;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Validation failed:\n${errorMessages.join('\n')}`);
      }
      throw new Error('Invalid preferences data');
    }
  }

  static createDefault(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 14,
      autoSave: true,
    };
  }

  static mergeWithDefaults(partial: Partial<UserPreferences>): UserPreferences {
    const defaults = this.createDefault();
    return { ...defaults, ...partial };
  }
}