interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

class PreferenceValidator {
  static validateTheme(theme: string): boolean {
    const validThemes = ['light', 'dark', 'auto'];
    return validThemes.includes(theme);
  }

  static validateLanguage(lang: string): boolean {
    const languagePattern = /^[a-z]{2}(-[A-Z]{2})?$/;
    return languagePattern.test(lang);
  }

  static validateTimezone(tz: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  }

  static validatePreferences(prefs: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (prefs.theme && !this.validateTheme(prefs.theme)) {
      errors.push('Invalid theme selection');
    }

    if (prefs.language && !this.validateLanguage(prefs.language)) {
      errors.push('Invalid language code format');
    }

    if (prefs.timezone && !this.validateTimezone(prefs.timezone)) {
      errors.push('Invalid timezone identifier');
    }

    return errors;
  }
}

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  timezone: 'UTC'
};

function mergePreferences(
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...existing, ...updates };
  const validationErrors = PreferenceValidator.validatePreferences(merged);

  if (validationErrors.length > 0) {
    throw new Error(`Invalid preferences: ${validationErrors.join(', ')}`);
  }

  return merged;
}

export { UserPreferences, PreferenceValidator, defaultPreferences, mergePreferences };