import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).max(5).default('en'),
  itemsPerPage: z.number().min(5).max(100).default(25),
});

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    const result = UserPreferencesSchema.safeParse(input);
    
    if (!result.success) {
      console.warn('Invalid preferences, using defaults:', result.error.errors);
      return UserPreferencesSchema.parse({});
    }
    
    return result.data;
  }

  static mergeWithDefaults(partial: Partial<UserPreferences>): UserPreferences {
    return this.validate({ ...UserPreferencesSchema.parse({}), ...partial });
  }
}

export function savePreferences(prefs: UserPreferences): void {
  const validated = PreferencesValidator.validate(prefs);
  localStorage.setItem('userPreferences', JSON.stringify(validated));
}

export function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  
  if (!stored) {
    return PreferencesValidator.validate({});
  }
  
  try {
    const parsed = JSON.parse(stored);
    return PreferencesValidator.validate(parsed);
  } catch {
    return PreferencesValidator.validate({});
  }
}