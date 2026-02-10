import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'auto']);
const NotificationPreferenceSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sms: z.boolean(),
});

const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default('auto'),
  notifications: NotificationPreferenceSchema.default({
    email: true,
    push: false,
    sms: false,
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
      throw new Error(`Invalid user preferences: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(userId: string): UserPreferences {
  return UserPreferencesSchema.parse({ userId });
}