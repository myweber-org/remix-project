import { z } from 'zod';

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }),
  language: z.string().min(2).max(5).default('en')
}).refine(
  (data) => !(data.privacy.profileVisibility === 'public' && data.privacy.searchIndexing === false),
  {
    message: 'Public profiles must be searchable',
    path: ['privacy', 'searchIndexing']
  }
);

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return userPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Invalid preferences: ${formattedErrors.join('; ')}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(): UserPreferences {
  return userPreferencesSchema.parse({});
}import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({}),
  language: z.string().min(2).max(5).default('en')
}).strict();

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Invalid preferences: ${JSON.stringify(formattedErrors)}`);
    }
    throw error;
  }
}

export function mergeWithDefaults(partialPrefs: Partial<UserPreferences>): UserPreferences {
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: {
      email: true,
      push: false,
      frequency: 'daily'
    },
    privacy: {
      profileVisibility: 'friends',
      searchIndexing: true
    },
    language: 'en'
  };

  return PreferenceSchema.parse({
    ...defaultPreferences,
    ...partialPrefs,
    notifications: {
      ...defaultPreferences.notifications,
      ...partialPrefs.notifications
    },
    privacy: {
      ...defaultPreferences.privacy,
      ...partialPrefs.privacy
    }
  });
}