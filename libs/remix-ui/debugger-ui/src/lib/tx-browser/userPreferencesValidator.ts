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
  itemsPerPage: z.number().min(5).max(100).default(20)
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(data: unknown): UserPreferences {
  return UserPreferencesSchema.parse(data);
}

export function safeValidateUserPreferences(data: unknown) {
  return UserPreferencesSchema.safeParse(data);
}

export function getDefaultPreferences(): UserPreferences {
  return {
    theme: 'auto',
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    language: 'en',
    timezone: 'UTC',
    itemsPerPage: 20
  };
}