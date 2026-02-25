import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  })
}).refine((data) => {
  return !(data.privacy.profileVisibility === 'private' && data.privacy.searchIndexing);
}, {
  message: 'Private profiles cannot be indexed by search engines',
  path: ['privacy.searchIndexing']
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      throw new ValidationError('Invalid user preferences', formattedErrors);
    }
    throw error;
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = {
    ...existing,
    ...updates,
    notifications: {
      ...existing.notifications,
      ...updates.notifications
    },
    privacy: {
      ...existing.privacy,
      ...updates.privacy
    }
  };
  
  return validateUserPreferences(merged);
}import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'system']);
const LanguageSchema = z.enum(['en', 'es', 'fr', 'de']);
const NotificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(['instant', 'daily', 'weekly']).optional(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default('system'),
  language: LanguageSchema.default('en'),
  notifications: NotificationSettingsSchema.default({
    email: true,
    push: false,
  }),
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

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  itemsPerPage: z.number().int().min(5).max(100)
});

export function validateUserPreferences(data: unknown): UserPreferences {
  return UserPreferencesSchema.parse(data);
}

export function safeValidateUserPreferences(data: unknown): { success: boolean; data?: UserPreferences; error?: string } {
  try {
    const validatedData = UserPreferencesSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Unknown validation error' };
  }
}