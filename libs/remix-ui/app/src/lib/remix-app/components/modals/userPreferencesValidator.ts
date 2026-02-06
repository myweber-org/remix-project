import { z } from 'zod';

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  })
}).refine((data) => {
  return !(data.privacy.profileVisibility === 'private' && data.privacy.searchIndexing);
}, {
  message: 'Private profiles cannot be indexed by search engines',
  path: ['privacy', 'searchIndexing']
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return userPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Validation failed: ${JSON.stringify(formattedErrors)}`);
    }
    throw error;
  }
}