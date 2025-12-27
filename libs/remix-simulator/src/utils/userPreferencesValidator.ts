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
      const fieldErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Validation failed: ${JSON.stringify(fieldErrors, null, 2)}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return userPreferencesSchema.parse({});
}