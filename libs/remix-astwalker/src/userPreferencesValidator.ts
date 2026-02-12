interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];
const VALID_TIMEZONES = /^[A-Za-z_]+\/[A-Za-z_]+$/;

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const errors: string[] = [];

  if (!prefs.theme || !['light', 'dark', 'auto'].includes(prefs.theme)) {
    errors.push('Theme must be "light", "dark", or "auto"');
  }

  if (typeof prefs.notifications !== 'boolean') {
    errors.push('Notifications must be a boolean value');
  }

  if (!prefs.language || !SUPPORTED_LANGUAGES.includes(prefs.language)) {
    errors.push(`Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }

  if (!prefs.timezone || !VALID_TIMEZONES.test(prefs.timezone)) {
    errors.push('Timezone must be in format "Area/Location" (e.g., America/New_York)');
  }

  if (errors.length > 0) {
    throw new PreferenceValidationError(`Invalid preferences: ${errors.join('; ')}`);
  }

  return prefs as UserPreferences;
}

function normalizePreferences(input: unknown): Partial<UserPreferences> {
  if (typeof input !== 'object' || input === null) {
    return {};
  }

  const normalized: Partial<UserPreferences> = {};
  const raw = input as Record<string, unknown>;

  if (typeof raw.theme === 'string') {
    normalized.theme = raw.theme as UserPreferences['theme'];
  }

  if (typeof raw.notifications === 'boolean') {
    normalized.notifications = raw.notifications;
  }

  if (typeof raw.language === 'string') {
    normalized.language = raw.language;
  }

  if (typeof raw.timezone === 'string') {
    normalized.timezone = raw.timezone;
  }

  return normalized;
}

export { validateUserPreferences, normalizePreferences, PreferenceValidationError };
export type { UserPreferences };import { z } from 'zod';

export const UserPreferencesSchema = z.object({
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
}).strict();

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return UserPreferencesSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(issue => 
          `${issue.path.join('.')}: ${issue.message}`
        );
        throw new Error(`Invalid preferences: ${issues.join(', ')}`);
      }
      throw new Error('Unexpected validation error');
    }
  }

  static sanitize(input: Record<string, unknown>): Partial<UserPreferences> {
    const result: Partial<UserPreferences> = {};
    
    if (typeof input.theme === 'string' && 
        ['light', 'dark', 'auto'].includes(input.theme)) {
      result.theme = input.theme as 'light' | 'dark' | 'auto';
    }

    if (input.notifications && typeof input.notifications === 'object') {
      const notif = input.notifications as Record<string, unknown>;
      result.notifications = {
        email: typeof notif.email === 'boolean' ? notif.email : true,
        push: typeof notif.push === 'boolean' ? notif.push : false,
        frequency: typeof notif.frequency === 'string' && 
                  ['instant', 'daily', 'weekly'].includes(notif.frequency) 
                  ? notif.frequency as 'instant' | 'daily' | 'weekly' 
                  : 'daily'
      };
    }

    if (input.privacy && typeof input.privacy === 'object') {
      const priv = input.privacy as Record<string, unknown>;
      result.privacy = {
        profileVisibility: typeof priv.profileVisibility === 'string' &&
                          ['public', 'private', 'friends'].includes(priv.profileVisibility)
                          ? priv.profileVisibility as 'public' | 'private' | 'friends'
                          : 'friends',
        dataSharing: typeof priv.dataSharing === 'boolean' ? priv.dataSharing : false
      };
    }

    if (typeof input.language === 'string' && 
        input.language.length >= 2 && 
        input.language.length <= 5) {
      result.language = input.language;
    }

    return result;
  }
}