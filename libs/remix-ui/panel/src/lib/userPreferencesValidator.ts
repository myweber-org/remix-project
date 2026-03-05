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
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

const validateUserPreferences = (prefs: UserPreferences): void => {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Invalid theme '${prefs.theme}'. Must be one of: ${validThemes.join(', ')}`
    );
  }
  
  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }
  
  if (!prefs.language || prefs.language.trim().length === 0) {
    throw new PreferenceValidationError('Language must be a non-empty string');
  }
  
  if (prefs.fontSize < 12 || prefs.fontSize > 24) {
    throw new PreferenceValidationError('Font size must be between 12 and 24');
  }
  
  if (!Number.isInteger(prefs.fontSize)) {
    throw new PreferenceValidationError('Font size must be an integer');
  }
};

export { UserPreferences, PreferenceValidationError, validateUserPreferences };