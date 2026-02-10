
interface UserPreferences {
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

export function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaults, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceValidationError(
      `Invalid theme: ${validated.theme}. Must be 'light', 'dark', or 'auto'`
    );
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be a boolean value');
  }

  if (!validated.language || validated.language.trim().length === 0) {
    throw new PreferenceValidationError('Language must be a non-empty string');
  }

  if (validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceValidationError('Font size must be between 8 and 72');
  }

  if (!Number.isInteger(validated.fontSize)) {
    throw new PreferenceValidationError('Font size must be an integer');
  }

  return validated;
}

export function formatPreferencesForDisplay(prefs: UserPreferences): string {
  const themeMap = {
    light: 'Light Mode',
    dark: 'Dark Mode',
    auto: 'System Default'
  };

  return `Theme: ${themeMap[prefs.theme]}
Notifications: ${prefs.notifications ? 'Enabled' : 'Disabled'}
Language: ${prefs.language.toUpperCase()}
Font Size: ${prefs.fontSize}pt`;
}