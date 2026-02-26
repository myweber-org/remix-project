
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidator {
  private static readonly MIN_FONT_SIZE = 12;
  private static readonly MAX_FONT_SIZE = 24;
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}`);
    }

    if (prefs.fontSize < PreferenceValidator.MIN_FONT_SIZE || 
        prefs.fontSize > PreferenceValidator.MAX_FONT_SIZE) {
      errors.push(`Font size must be between ${PreferenceValidator.MIN_FONT_SIZE} and ${PreferenceValidator.MAX_FONT_SIZE}`);
    }

    return errors;
  }

  static validateAndThrow(prefs: UserPreferences): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Validation failed:\n${errors.join('\n')}`);
    }
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
  timezone: z.string().default('UTC'),
  twoFactorEnabled: z.boolean().default(false),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(
  input: unknown
): UserPreferences | null {
  const result = UserPreferencesSchema.safeParse(input);
  return result.success ? result.data : null;
}

export function createDefaultPreferences(userId: string): UserPreferences {
  return UserPreferencesSchema.parse({ userId });
}