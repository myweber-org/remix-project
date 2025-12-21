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
const VALID_RESULTS_PER_PAGE = [10, 20, 50, 100];

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

  private validatePreferences(data: any): UserPreferences {
    const preferences: UserPreferences = { ...DEFAULT_PREFERENCES };

    if (data.theme && ['light', 'dark', 'auto'].includes(data.theme)) {
      preferences.theme = data.theme;
    }

    if (typeof data.notifications === 'boolean') {
      preferences.notifications = data.notifications;
    }

    if (data.language && VALID_LANGUAGES.includes(data.language)) {
      preferences.language = data.language;
    }

    if (data.resultsPerPage && VALID_RESULTS_PER_PAGE.includes(data.resultsPerPage)) {
      preferences.resultsPerPage = data.resultsPerPage;
    }

    return preferences;
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const validated = this.validatePreferences({
      ...this.preferences,
      ...updates
    });

    this.preferences = validated;
    localStorage.setItem('userPreferences', JSON.stringify(validated));
    
    return { ...validated };
  }

  resetToDefaults(): UserPreferences {
    this.preferences = { ...DEFAULT_PREFERENCES };
    localStorage.removeItem('userPreferences');
    return { ...this.preferences };
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export const userPreferencesService = new UserPreferencesService();