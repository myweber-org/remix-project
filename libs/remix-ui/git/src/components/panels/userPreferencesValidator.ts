import { z } from 'zod';

const ThemePreferenceSchema = z.enum(['light', 'dark', 'system']);
const NotificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(['immediate', 'daily', 'weekly']).optional(),
});

const UserPreferencesSchema = z.object({
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

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid preferences: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

export function getDefaultPreferences(userId: string): UserPreferences {
  return UserPreferencesSchema.parse({ userId });
}