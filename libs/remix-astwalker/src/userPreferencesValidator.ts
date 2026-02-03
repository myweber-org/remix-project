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
export type { UserPreferences };