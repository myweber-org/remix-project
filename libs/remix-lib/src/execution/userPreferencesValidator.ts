
interface UserPreferences {
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

export function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const errors: string[] = [];

  if (!prefs.theme || !['light', 'dark', 'auto'].includes(prefs.theme)) {
    errors.push('Theme must be light, dark, or auto');
  }

  if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
    errors.push('Notifications must be a boolean value');
  }

  if (prefs.language && typeof prefs.language !== 'string') {
    errors.push('Language must be a string');
  }

  if (prefs.fontSize !== undefined) {
    if (typeof prefs.fontSize !== 'number') {
      errors.push('Font size must be a number');
    } else if (prefs.fontSize < 12 || prefs.fontSize > 24) {
      errors.push('Font size must be between 12 and 24');
    }
  }

  if (errors.length > 0) {
    throw new PreferenceError(errors.join('; '), 'validation');
  }

  return {
    theme: prefs.theme || 'auto',
    notifications: prefs.notifications ?? true,
    language: prefs.language || 'en',
    fontSize: prefs.fontSize || 16,
  };
}

export function parsePreferencesFromJSON(jsonString: string): UserPreferences {
  try {
    const parsed = JSON.parse(jsonString);
    return validateUserPreferences(parsed);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new PreferenceError('Invalid JSON format', 'parsing');
    }
    throw error;
  }
}
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;

  static validate(prefs: Partial<UserPreferences>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (prefs.theme !== undefined && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'`);
    }

    if (prefs.language !== undefined && !this.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}. Supported: ${this.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (prefs.fontSize !== undefined) {
      if (typeof prefs.fontSize !== 'number') {
        errors.push(`Font size must be a number, got ${typeof prefs.fontSize}`);
      } else if (prefs.fontSize < this.MIN_FONT_SIZE || prefs.fontSize > this.MAX_FONT_SIZE) {
        errors.push(`Font size ${prefs.fontSize} out of range (${this.MIN_FONT_SIZE}-${this.MAX_FONT_SIZE})`);
      }
    }

    if (prefs.notifications !== undefined && typeof prefs.notifications !== 'boolean') {
      errors.push(`Notifications must be boolean, got ${typeof prefs.notifications}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static createDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 16
    };
  }
}

export { UserPreferences, PreferenceValidator };import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'system']);
const NotificationPreferenceSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sms: z.boolean(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default('system'),
  notifications: NotificationPreferenceSchema.default({
    email: true,
    push: false,
    sms: false,
  }),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().optional(),
  twoFactorEnabled: z.boolean().default(false),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(
  data: unknown
): UserPreferences | null {
  const result = UserPreferencesSchema.safeParse(data);
  return result.success ? result.data : null;
}

export function createDefaultPreferences(
  userId: string
): UserPreferences {
  return UserPreferencesSchema.parse({ userId });
}