import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'system'], {
  errorMap: () => ({ message: 'Theme must be light, dark, or system' })
});

const NotificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(['immediate', 'daily', 'weekly']).optional()
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid({ message: 'Invalid user ID format' }),
  theme: ThemeSchema,
  notifications: NotificationSettingsSchema,
  language: z.string().min(2).max(5),
  timezone: z.string().refine(
    tz => Intl.supportedValuesOf('timeZone').includes(tz),
    { message: 'Unsupported timezone' }
  ),
  createdAt: z.date().default(() => new Date())
}).strict();

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Validation failed:\n${formattedErrors.join('\n')}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(userId: string): UserPreferences {
  return {
    userId,
    theme: 'system',
    notifications: { email: true, push: false, frequency: 'daily' },
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}