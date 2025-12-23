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

class UserPreferencesService {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem('userPreferences');
    if (!stored) return { ...DEFAULT_PREFERENCES };

    try {
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  private validatePreferences(data: unknown): UserPreferences {
    const prefs = { ...DEFAULT_PREFERENCES };

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;

      if (obj.theme && ['light', 'dark', 'auto'].includes(obj.theme as string)) {
        prefs.theme = obj.theme as UserPreferences['theme'];
      }

      if (typeof obj.notifications === 'boolean') {
        prefs.notifications = obj.notifications;
      }

      if (obj.language && VALID_LANGUAGES.includes(obj.language as string)) {
        prefs.language = obj.language as string;
      }

      if (typeof obj.resultsPerPage === 'number') {
        prefs.resultsPerPage = Math.max(
          MIN_RESULTS_PER_PAGE,
          Math.min(MAX_RESULTS_PER_PAGE, obj.resultsPerPage)
        );
      }
    }

    return prefs;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const newPreferences = { ...this.preferences, ...updates };
    this.preferences = this.validatePreferences(newPreferences);
    this.savePreferences();
    return this.getPreferences();
  }

  resetToDefaults(): UserPreferences {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
    return this.getPreferences();
  }

  private savePreferences(): void {
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
  }
}

export const userPreferencesService = new UserPreferencesService();