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
  }).default({})
}).refine(
  (data) => !(data.notifications.push && data.privacy.profileVisibility === 'private'),
  {
    message: 'Push notifications require public or friends profile visibility',
    path: ['notifications.push']
  }
);

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        throw new PreferencesValidationError('Invalid preferences configuration', formattedErrors);
      }
      throw error;
    }
  }

  static validatePartial(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const schema = UserPreferencesSchema.partial();
    return schema.parse(updates);
  }
}

export class PreferencesValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'PreferencesValidationError';
  }
}

export function sanitizePreferences(prefs: UserPreferences): UserPreferences {
  const { privacy, ...rest } = prefs;
  return {
    ...rest,
    privacy: {
      ...privacy,
      searchIndexing: privacy.profileVisibility === 'private' ? false : privacy.searchIndexing
    }
  };
}