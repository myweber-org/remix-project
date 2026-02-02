import { z } from 'zod';

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    dataSharing: z.boolean().default(false)
  })
}).refine((data) => {
  return !(data.privacy.dataSharing && data.privacy.profileVisibility === 'private');
}, {
  message: 'Cannot enable data sharing while profile is private',
  path: ['privacy.dataSharing']
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return userPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Validation failed: ${errorMessages.join('; ')}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(): UserPreferences {
  return userPreferencesSchema.parse({});
}