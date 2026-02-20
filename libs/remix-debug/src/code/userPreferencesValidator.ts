
interface UserPreferences {
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

export { UserPreferences, PreferenceValidator };import { z } from 'zod';

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    dataSharing: z.boolean().default(false)
  }),
  language: z.string().min(2).max(5).default('en')
}).refine((data) => {
  return !(data.privacy.dataSharing && data.privacy.profileVisibility === 'private');
}, {
  message: 'Cannot share data while profile is private',
  path: ['privacy.dataSharing']
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  return userPreferencesSchema.parse(input);
}

export function validatePartialPreferences(updates: Partial<UserPreferences>): Partial<UserPreferences> {
  const partialSchema = userPreferencesSchema.partial();
  return partialSchema.parse(updates);
}