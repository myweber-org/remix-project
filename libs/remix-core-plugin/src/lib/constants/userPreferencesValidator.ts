interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
  twoFactorAuth: boolean;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

const VALID_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'] as const;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: Partial<UserPreferences> = {};

  if (prefs.theme !== undefined) {
    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      throw new PreferenceValidationError(`Invalid theme: ${prefs.theme}`);
    }
    validated.theme = prefs.theme;
  } else {
    validated.theme = 'auto';
  }

  if (prefs.notifications !== undefined) {
    if (typeof prefs.notifications !== 'boolean') {
      throw new PreferenceValidationError('Notifications must be boolean');
    }
    validated.notifications = prefs.notifications;
  } else {
    validated.notifications = true;
  }

  if (prefs.language !== undefined) {
    if (!VALID_LANGUAGES.includes(prefs.language as any)) {
      throw new PreferenceValidationError(`Unsupported language: ${prefs.language}`);
    }
    validated.language = prefs.language;
  } else {
    validated.language = 'en';
  }

  if (prefs.fontSize !== undefined) {
    if (typeof prefs.fontSize !== 'number' || prefs.fontSize < MIN_FONT_SIZE || prefs.fontSize > MAX_FONT_SIZE) {
      throw new PreferenceValidationError(`Font size must be between ${MIN_FONT_SIZE} and ${MAX_FONT_SIZE}`);
    }
    validated.fontSize = prefs.fontSize;
  } else {
    validated.fontSize = 16;
  }

  if (prefs.twoFactorAuth !== undefined) {
    if (typeof prefs.twoFactorAuth !== 'boolean') {
      throw new PreferenceValidationError('Two-factor authentication must be boolean');
    }
    validated.twoFactorAuth = prefs.twoFactorAuth;
  } else {
    validated.twoFactorAuth = false;
  }

  return validated as UserPreferences;
}

function mergeUserPreferences(
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  return validateUserPreferences(merged);
}

export { UserPreferences, PreferenceValidationError, validateUserPreferences, mergeUserPreferences };