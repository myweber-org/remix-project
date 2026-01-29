typescript
interface UserPreferences {
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
const MIN_RESULTS_PER_PAGE = 10;
const MAX_RESULTS_PER_PAGE = 100;

class UserPreferencesManager {
  private storageKey: string;

  constructor(storageKey: string = 'userPreferences') {
    this.storageKey = storageKey;
  }

  validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

    if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
      validated.theme = prefs.theme;
    }

    if (typeof prefs.notifications === 'boolean') {
      validated.notifications = prefs.notifications;
    }

    if (prefs.language && VALID_LANGUAGES.includes(prefs.language)) {
      validated.language = prefs.language;
    }

    if (typeof prefs.resultsPerPage === 'number') {
      validated.resultsPerPage = Math.max(
        MIN_RESULTS_PER_PAGE,
        Math.min(MAX_RESULTS_PER_PAGE, prefs.resultsPerPage)
      );
    }

    return validated;
  }

  savePreferences(prefs: Partial<UserPreferences>): boolean {
    try {
      const validated = this.validatePreferences(prefs);
      localStorage.setItem(this.storageKey, JSON.stringify(validated));
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  }

  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return DEFAULT_PREFERENCES;

      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }

  resetToDefaults(): boolean {
    return this.savePreferences(DEFAULT_PREFERENCES);
  }

  getCurrentTheme(): 'light' | 'dark' {
    const prefs = this.loadPreferences();
    
    if (prefs.theme !== 'auto') {
      return prefs.theme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}

export { UserPreferencesManager, type UserPreferences };
```