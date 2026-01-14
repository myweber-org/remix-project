interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(
    public field: keyof UserPreferences,
    message: string
  ) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

export function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaults, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceValidationError('theme', 'Theme must be light, dark, or auto');
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceValidationError('notifications', 'Notifications must be a boolean');
  }

  if (typeof validated.language !== 'string' || validated.language.length === 0) {
    throw new PreferenceValidationError('language', 'Language must be a non-empty string');
  }

  if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceValidationError('fontSize', 'Font size must be between 8 and 72');
  }

  return validated;
}

export function safeValidatePreferences(prefs: Partial<UserPreferences>): {
  success: boolean;
  data?: UserPreferences;
  error?: PreferenceValidationError;
} {
  try {
    const validated = validateUserPreferences(prefs);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      return { success: false, error };
    }
    throw error;
  }
}