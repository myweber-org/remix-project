import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5),
  fontSize: z.number().min(12).max(24),
  autoSave: z.boolean().default(true),
  twoFactorAuth: z.boolean().optional()
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(data: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Invalid preferences: ${errorMessages.join('; ')}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(): UserPreferences {
  return {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 16,
    autoSave: true
  };
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const defaultPrefs = createDefaultPreferences();
  const merged = { ...defaultPrefs, ...existing, ...updates };
  return validatePreferences(merged);
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

const validateUserPreferences = (prefs: UserPreferences): void => {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceValidationError(
      `Theme must be one of: ${validThemes.join(', ')}`,
      'theme'
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError(
      'Notifications must be a boolean value',
      'notifications'
    );
  }

  if (!prefs.language || prefs.language.trim().length === 0) {
    throw new PreferenceValidationError(
      'Language must be specified',
      'language'
    );
  }

  if (prefs.fontSize < 12 || prefs.fontSize > 24) {
    throw new PreferenceValidationError(
      'Font size must be between 12 and 24',
      'fontSize'
    );
  }
};

const createDefaultPreferences = (): UserPreferences => ({
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 16
});

export { UserPreferences, PreferenceValidationError, validateUserPreferences, createDefaultPreferences };