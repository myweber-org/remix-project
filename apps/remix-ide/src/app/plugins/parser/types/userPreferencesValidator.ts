import { z } from 'zod';

const ThemePreferenceSchema = z.enum(['light', 'dark', 'system']);
const NotificationSettingSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(['immediate', 'daily', 'weekly']).optional(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemePreferenceSchema.default('system'),
  notifications: NotificationSettingSchema.default({
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

export function sanitizeUserPreferencesUpdate(
  partialUpdate: Partial<UserPreferences>
): Partial<UserPreferences> {
  const updateSchema = UserPreferencesSchema.partial();
  return updateSchema.parse(partialUpdate);
}