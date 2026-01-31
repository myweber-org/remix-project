import { z } from 'zod';

const ThemePreferenceSchema = z.enum(['light', 'dark', 'system']);
const NotificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(['instant', 'daily', 'weekly']).optional(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemePreferenceSchema.default('system'),
  notifications: NotificationSettingsSchema.default({
    email: true,
    push: false,
  }),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function isUserPreferences(input: unknown): input is UserPreferences {
  return UserPreferencesSchema.safeParse(input).success;
}