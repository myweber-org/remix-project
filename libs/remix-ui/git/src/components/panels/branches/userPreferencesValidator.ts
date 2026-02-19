import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  itemsPerPage: z.number().int().min(5).max(100)
});

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  itemsPerPage: 20
};

export function validatePreferences(input: unknown): UserPreferences {
  try {
    const parsed = UserPreferencesSchema.parse(input);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch (error) {
    console.warn('Invalid preferences provided, using defaults:', error);
    return DEFAULT_PREFERENCES;
  }
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validatePreferences(merged);
}

export function isPreferencesValid(prefs: UserPreferences): boolean {
  return UserPreferencesSchema.safeParse(prefs).success;
}import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notificationsEnabled: z.boolean().default(true),
  itemsPerPage: z.number().min(5).max(100).default(25),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().optional(),
  twoFactorEnabled: z.boolean().default(false),
  emailFrequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        throw new Error(`Invalid preferences: ${errorMessages}`);
      }
      throw new Error('Unexpected validation error');
    }
  }

  static validatePartial(input: Partial<unknown>): Partial<UserPreferences> {
    try {
      return UserPreferencesSchema.partial().parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        throw new Error(`Invalid partial preferences: ${errorMessages}`);
      }
      throw new Error('Unexpected validation error');
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return UserPreferencesSchema.parse({});
  }
}

export function sanitizePreferences(prefs: UserPreferences): UserPreferences {
  const sanitized = { ...prefs };
  
  if (sanitized.timezone && !isValidTimezone(sanitized.timezone)) {
    delete sanitized.timezone;
  }

  if (sanitized.language && !isValidLanguageCode(sanitized.language)) {
    sanitized.language = 'en';
  }

  return sanitized;
}

function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

function isValidLanguageCode(code: string): boolean {
  return /^[a-z]{2,3}(-[A-Z]{2})?$/.test(code);
}