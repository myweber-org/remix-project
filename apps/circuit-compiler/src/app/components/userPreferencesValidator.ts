import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean()
  }),
  language: z.string().min(2).max(5),
  timezone: z.string(),
  resultsPerPage: z.number().min(5).max(100).default(20)
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(data: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Invalid preferences: ${errorMessages.join(', ')}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(): UserPreferences {
  return {
    theme: 'auto',
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    language: 'en',
    timezone: 'UTC',
    resultsPerPage: 20
  };
}