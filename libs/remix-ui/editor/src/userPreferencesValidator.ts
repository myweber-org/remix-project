import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
  }),
  language: z.string().min(2).max(5).default('en'),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchIndexing: z.boolean().default(true),
  }),
});

type UserPreferences = z.infer<typeof PreferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  try {
    return PreferenceSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed:', error.errors);
      throw new Error('Invalid preferences configuration');
    }
    throw error;
  }
}

export function getDefaultPreferences(): UserPreferences {
  return PreferenceSchema.parse({});
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

function validateUserPreferences(prefs: UserPreferences): void {
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
    throw new PreferenceValidationError('Language must be specified');
  }
  
  if (prefs.fontSize < 12 || prefs.fontSize > 24) {
    throw new PreferenceValidationError('Font size must be between 12 and 24');
  }
}

function validateAndUpdatePreferences(
  currentPrefs: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const mergedPrefs = { ...currentPrefs, ...updates };
  
  try {
    validateUserPreferences(mergedPrefs);
    return mergedPrefs;
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      console.error(`Preference validation failed: ${error.message}`);
      throw error;
    }
    throw new PreferenceValidationError('Unknown validation error occurred');
  }
}

export { UserPreferences, PreferenceValidationError, validateUserPreferences, validateAndUpdatePreferences };