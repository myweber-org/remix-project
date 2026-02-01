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
}