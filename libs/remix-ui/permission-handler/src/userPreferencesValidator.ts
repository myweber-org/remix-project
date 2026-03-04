interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  itemsPerPage: 25
};

const THEME_VALUES = ['light', 'dark', 'auto'] as const;

function validatePreferences(input: unknown): UserPreferences {
  if (!input || typeof input !== 'object') {
    return DEFAULT_PREFERENCES;
  }

  const partial = input as Partial<UserPreferences>;
  
  return {
    theme: THEME_VALUES.includes(partial.theme as any) 
      ? partial.theme as UserPreferences['theme']
      : DEFAULT_PREFERENCES.theme,
    
    notifications: typeof partial.notifications === 'boolean'
      ? partial.notifications
      : DEFAULT_PREFERENCES.notifications,
    
    language: typeof partial.language === 'string' 
      && partial.language.length >= 2
      ? partial.language
      : DEFAULT_PREFERENCES.language,
    
    itemsPerPage: typeof partial.itemsPerPage === 'number'
      && partial.itemsPerPage > 0
      && partial.itemsPerPage <= 100
      ? Math.floor(partial.itemsPerPage)
      : DEFAULT_PREFERENCES.itemsPerPage
  };
}

function mergePreferences(
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const validatedUpdates = validatePreferences(updates);
  
  return {
    ...existing,
    ...validatedUpdates
  };
}

export { UserPreferences, validatePreferences, mergePreferences, DEFAULT_PREFERENCES };import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    dataSharing: z.boolean().default(false)
  }),
  language: z.string().min(2).max(5).default('en')
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
          message: issue.message
        }));
        throw new ValidationError('Invalid user preferences', issues);
      }
      throw error;
    }
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

export function sanitizePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated = PreferencesValidator.validate(prefs);
  return {
    ...PreferencesValidator.getDefaults(),
    ...validated
  };
}