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
}import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('light'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({}),
  updatedAt: z.date().optional()
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed:', error.errors);
      throw new Error(`Invalid preferences: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const base = PreferenceSchema.parse({});
  return PreferenceSchema.parse({
    ...base,
    ...existing,
    ...updates,
    updatedAt: new Date()
  });
}

export function getDefaultPreferences(): UserPreferences {
  return PreferenceSchema.parse({});
}