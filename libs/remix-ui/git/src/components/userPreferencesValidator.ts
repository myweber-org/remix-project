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
}