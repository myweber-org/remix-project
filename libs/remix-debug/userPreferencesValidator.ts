import { z } from "zod";

const UserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "auto"]).default("auto"),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(["immediate", "daily", "weekly"]).default("daily")
  }),
  privacy: z.object({
    profileVisibility: z.enum(["public", "friends", "private"]).default("friends"),
    searchIndexing: z.boolean().default(true)
  }).default({}),
  language: z.string().min(2).max(5).default("en")
}).strict();

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid user preferences: ${error.errors.map(e => `${e.path}: ${e.message}`).join(", ")}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}

export function mergePreferences(existing: Partial<UserPreferences>, updates: Partial<UserPreferences>): UserPreferences {
  const current = UserPreferencesSchema.partial().parse(existing);
  const changes = UserPreferencesSchema.partial().parse(updates);
  
  return UserPreferencesSchema.parse({
    ...current,
    ...changes,
    notifications: {
      ...current.notifications,
      ...changes.notifications
    },
    privacy: {
      ...current.privacy,
      ...changes.privacy
    }
  });
}
import { z } from 'zod';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  timezone: z.string().regex(/^[A-Za-z_]+\/[A-Za-z_]+$/)
});

export class PreferencesValidator {
  static validate(preferences: unknown): UserPreferences {
    try {
      return userPreferencesSchema.parse(preferences) as UserPreferences;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
      }
      throw new Error('Invalid preferences format');
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    const partialSchema = userPreferencesSchema.partial();
    return partialSchema.parse(updates) as Partial<UserPreferences>;
  }
}

export function sanitizePreferences(prefs: UserPreferences): UserPreferences {
  return {
    ...prefs,
    language: prefs.language.toLowerCase(),
    timezone: prefs.timezone.replace(/\s+/g, '_')
  };
}typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
      errors.push(`Font size ${prefs.fontSize} is out of range. Must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}`);
    }

    return errors;
  }

  static validateAndThrow(prefs: UserPreferences): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Validation failed:\n${errors.join('\n')}`);
    }
  }
}

function saveUserPreferences(prefs: UserPreferences): { success: boolean; errors?: string[] } {
  const validationErrors = PreferenceValidator.validate(prefs);
  
  if (validationErrors.length > 0) {
    return {
      success: false,
      errors: validationErrors
    };
  }

  console.log('Saving preferences:', prefs);
  return { success: true };
}

export { UserPreferences, PreferenceValidator, saveUserPreferences };
```