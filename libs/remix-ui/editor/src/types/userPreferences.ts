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

export { UserPreferences, PreferenceValidator, defaultPreferences, mergePreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 14
};

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
    validated.theme = prefs.theme;
  }

  if (typeof prefs.notifications === 'boolean') {
    validated.notifications = prefs.notifications;
  }

  if (prefs.language && typeof prefs.language === 'string') {
    validated.language = prefs.language;
  }

  if (prefs.fontSize && typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 24) {
    validated.fontSize = prefs.fontSize;
  }

  return validated;
}

function savePreferences(prefs: Partial<UserPreferences>): void {
  const validated = validatePreferences(prefs);
  localStorage.setItem('userPreferences', JSON.stringify(validated));
}

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  if (stored) {
    try {
      return validatePreferences(JSON.parse(stored));
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }
  return DEFAULT_PREFERENCES;
}

export { UserPreferences, validatePreferences, savePreferences, loadPreferences };interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  resultsPerPage: 20
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const VALID_RESULTS_PER_PAGE = [10, 20, 50, 100];

class UserPreferencesService {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const validatedUpdates = this.validateUpdates(updates);
    this.preferences = { ...this.preferences, ...validatedUpdates };
    this.savePreferences();
    return this.getPreferences();
  }

  resetToDefaults(): UserPreferences {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
    return this.getPreferences();
  }

  private validateUpdates(updates: Partial<UserPreferences>): Partial<UserPreferences> {
    const validated: Partial<UserPreferences> = {};

    if (updates.theme !== undefined) {
      if (['light', 'dark', 'auto'].includes(updates.theme)) {
        validated.theme = updates.theme;
      }
    }

    if (updates.notifications !== undefined) {
      validated.notifications = Boolean(updates.notifications);
    }

    if (updates.language !== undefined) {
      if (VALID_LANGUAGES.includes(updates.language)) {
        validated.language = updates.language;
      }
    }

    if (updates.resultsPerPage !== undefined) {
      if (VALID_RESULTS_PER_PAGE.includes(updates.resultsPerPage)) {
        validated.resultsPerPage = updates.resultsPerPage;
      }
    }

    return validated;
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private savePreferences(): void {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  }

  private validatePreferences(prefs: any): UserPreferences {
    return {
      theme: this.isValidTheme(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme,
      notifications: typeof prefs.notifications === 'boolean' ? prefs.notifications : DEFAULT_PREFERENCES.notifications,
      language: VALID_LANGUAGES.includes(prefs.language) ? prefs.language : DEFAULT_PREFERENCES.language,
      resultsPerPage: VALID_RESULTS_PER_PAGE.includes(prefs.resultsPerPage) ? prefs.resultsPerPage : DEFAULT_PREFERENCES.resultsPerPage
    };
  }

  private isValidTheme(theme: any): theme is UserPreferences['theme'] {
    return ['light', 'dark', 'auto'].includes(theme);
  }
}

export const userPreferencesService = new UserPreferencesService();