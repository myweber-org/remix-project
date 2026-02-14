import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'auto']);
const NotificationPreferenceSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sms: z.boolean(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default('auto'),
  notifications: NotificationPreferenceSchema.default({
    email: true,
    push: false,
    sms: false,
  }),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().default('UTC'),
  twoFactorEnabled: z.boolean().default(false),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(
  input: unknown
): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function sanitizeUserPreferences(
  partialInput: Partial<UserPreferences>
): Partial<UserPreferences> {
  return UserPreferencesSchema.partial().parse(partialInput);
}