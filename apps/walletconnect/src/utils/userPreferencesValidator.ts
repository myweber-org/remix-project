import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    dataSharing: z.boolean().default(false)
  }),
  language: z.string().min(2).max(5).default('en')
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

export function getDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}

export function mergePreferences(existing: Partial<UserPreferences>, updates: Partial<UserPreferences>): UserPreferences {
  const current = UserPreferencesSchema.partial().parse(existing);
  const merged = { ...current, ...updates };
  return UserPreferencesSchema.parse(merged);
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceError';
  }
}

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaults, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceError('Theme must be light, dark, or auto', 'theme');
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceError('Notifications must be a boolean value', 'notifications');
  }

  if (!validated.language || validated.language.trim().length === 0) {
    throw new PreferenceError('Language cannot be empty', 'language');
  }

  if (validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceError('Font size must be between 8 and 72', 'fontSize');
  }

  if (!Number.isInteger(validated.fontSize)) {
    throw new PreferenceError('Font size must be an integer', 'fontSize');
  }

  return validated;
}

function testValidation() {
  const testCases = [
    { theme: 'dark', fontSize: 16 },
    { theme: 'invalid', notifications: false },
    { language: '', fontSize: 12 },
    { fontSize: 100 },
    { fontSize: 14.5 }
  ];

  testCases.forEach((prefs, index) => {
    console.log(`Test case ${index + 1}:`, prefs);
    try {
      const result = validateUserPreferences(prefs);
      console.log('Validated:', result);
    } catch (error) {
      if (error instanceof PreferenceError) {
        console.log(`Error in field "${error.field}": ${error.message}`);
      } else {
        console.log('Unknown error:', error);
      }
    }
    console.log('---');
  });
}

export { validateUserPreferences, PreferenceError, UserPreferences };