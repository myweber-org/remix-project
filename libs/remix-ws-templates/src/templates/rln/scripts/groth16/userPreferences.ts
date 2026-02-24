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

class PreferenceManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem('userPreferences');
    if (!stored) return DEFAULT_PREFERENCES;

    try {
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  private validatePreferences(data: unknown): UserPreferences {
    if (!data || typeof data !== 'object') return DEFAULT_PREFERENCES;

    const prefs = { ...DEFAULT_PREFERENCES, ...data };

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      prefs.theme = DEFAULT_PREFERENCES.theme;
    }

    if (typeof prefs.notifications !== 'boolean') {
      prefs.notifications = DEFAULT_PREFERENCES.notifications;
    }

    if (!VALID_LANGUAGES.includes(prefs.language)) {
      prefs.language = DEFAULT_PREFERENCES.language;
    }

    if (typeof prefs.resultsPerPage !== 'number' || 
        prefs.resultsPerPage < MIN_RESULTS_PER_PAGE || 
        prefs.resultsPerPage > MAX_RESULTS_PER_PAGE) {
      prefs.resultsPerPage = DEFAULT_PREFERENCES.resultsPerPage;
    }

    return prefs;
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const newPreferences = { ...this.preferences, ...updates };
    const validated = this.validatePreferences(newPreferences);

    if (JSON.stringify(this.preferences) === JSON.stringify(validated)) {
      return false;
    }

    this.preferences = validated;
    localStorage.setItem('userPreferences', JSON.stringify(validated));
    return true;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = DEFAULT_PREFERENCES;
    localStorage.removeItem('userPreferences');
  }
}

export const preferenceManager = new PreferenceManager();