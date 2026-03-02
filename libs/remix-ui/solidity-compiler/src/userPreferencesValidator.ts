import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'system']);
const LanguageSchema = z.enum(['en', 'es', 'fr', 'de']);
const NotificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(['instant', 'daily', 'weekly']).optional(),
});

const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default('system'),
  language: LanguageSchema.default('en'),
  notifications: NotificationSettingsSchema.default({
    email: true,
    push: false,
  }),
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

export function createDefaultPreferences(userId: string): UserPreferences {
  return UserPreferencesSchema.parse({ userId });
}

export function updatePreferences(
  current: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...current, ...updates };
  return validateUserPreferences(merged);
}