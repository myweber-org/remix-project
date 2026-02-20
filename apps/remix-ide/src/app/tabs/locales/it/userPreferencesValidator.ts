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

function validateUserPreferences(prefs: UserPreferences): void {
  if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
    throw new PreferenceValidationError('Theme must be light, dark, or auto');
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }

  if (!SUPPORTED_LANGUAGES.includes(prefs.language)) {
    throw new PreferenceValidationError(`Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }

  if (!VALID_TIMEZONES.test(prefs.timezone)) {
    throw new PreferenceValidationError('Timezone must be in format Area/Location');
  }
}

function normalizePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    timezone: 'UTC'
  };

  const merged = { ...defaults, ...prefs };
  validateUserPreferences(merged);
  return merged;
}

export { UserPreferences, PreferenceValidationError, validateUserPreferences, normalizePreferences };import { z } from "zod";

const ThemeSchema = z.enum(["light", "dark", "system"]);
const NotificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(["instant", "daily", "weekly"]).default("daily"),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default("system"),
  language: z.string().min(2).max(5).default("en"),
  notifications: NotificationSettingsSchema.default({}),
  twoFactorEnabled: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function validatePartialPreferences(
  input: unknown
): Partial<UserPreferences> {
  return UserPreferencesSchema.partial().parse(input);
}