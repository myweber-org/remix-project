import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  })
}).strict();

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Invalid preferences: ${errorMessages.join('; ')}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return PreferenceSchema.parse({});
}

export function mergePreferences(existing: Partial<UserPreferences>, updates: Partial<UserPreferences>): UserPreferences {
  const current = PreferenceSchema.partial().parse(existing);
  const changes = PreferenceSchema.partial().parse(updates);
  
  const merged = { ...current, ...changes };
  return PreferenceSchema.parse(merged);
}
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 14
};

const THEME_VALUES = ['light', 'dark', 'auto'] as const;

function validatePreferences(input: unknown): UserPreferences {
  if (!input || typeof input !== 'object') {
    return DEFAULT_PREFERENCES;
  }

  const partial = input as Partial<UserPreferences>;
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (partial.theme && THEME_VALUES.includes(partial.theme)) {
    validated.theme = partial.theme;
  }

  if (typeof partial.notifications === 'boolean') {
    validated.notifications = partial.notifications;
  }

  if (typeof partial.language === 'string' && partial.language.trim().length > 0) {
    validated.language = partial.language.trim();
  }

  if (typeof partial.fontSize === 'number' && partial.fontSize >= 8 && partial.fontSize <= 32) {
    validated.fontSize = Math.round(partial.fontSize);
  }

  return validated;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  const validatedUpdates = validatePreferences(updates);
  return { ...existing, ...validatedUpdates };
}

export { validatePreferences, mergePreferences, DEFAULT_PREFERENCES };
export type { UserPreferences };