import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'system']);
const NotificationPreferenceSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(['immediate', 'daily', 'weekly']).optional(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default('system'),
  language: z.string().min(2).max(5).default('en'),
  notifications: NotificationPreferenceSchema.default({
    email: true,
    push: false,
  }),
  createdAt: z.date().default(() => new Date()),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function sanitizePreferencesUpdate(partial: Partial<UserPreferences>): Partial<UserPreferences> {
  const { userId, createdAt, ...updatableFields } = partial;
  return updatableFields;
}