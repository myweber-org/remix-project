import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.boolean().default(true),
  language: z.string().min(2).max(5).default('en'),
  fontSize: z.number().min(12).max(24).default(16),
  autoSave: z.boolean().default(false),
  twoFactorAuth: z.boolean().default(false),
  privacyLevel: z.enum(['public', 'friends', 'private']).default('private'),
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      throw new Error(`Invalid preferences: ${errorMessages}`);
    }
    throw new Error('Unexpected validation error');
  }
}

export function getDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}

export function mergePreferences(
  existing: Partial<UserPreferences>,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validateUserPreferences(merged);
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value.');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
      errors.push(`Font size ${prefs.fontSize} is out of range. Must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}.`);
    }

    return errors;
  }
}

function validateAndApplyPreferences(prefs: UserPreferences): void {
  const validationErrors = PreferenceValidator.validate(prefs);
  
  if (validationErrors.length > 0) {
    console.error('Invalid preferences:');
    validationErrors.forEach(error => console.error(`  - ${error}`));
    throw new Error('Preferences validation failed');
  }

  console.log('Preferences applied successfully:', prefs);
}

export { UserPreferences, PreferenceValidator, validateAndApplyPreferences };