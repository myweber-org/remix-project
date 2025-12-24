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

export const userPreferencesService = new UserPreferencesService();interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14
};

class PreferencesManager {
  private readonly STORAGE_KEY = 'user_preferences';
  
  constructor() {
    this.ensureDefaults();
  }

  private ensureDefaults(): void {
    const current = this.loadPreferences();
    const merged = { ...DEFAULT_PREFERENCES, ...current };
    this.savePreferences(merged);
  }

  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return DEFAULT_PREFERENCES;
      
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  savePreferences(prefs: Partial<UserPreferences>): boolean {
    try {
      const current = this.loadPreferences();
      const updated = { ...current, ...prefs };
      const validated = this.validatePreferences(updated);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validated));
      return true;
    } catch {
      return false;
    }
  }

  resetToDefaults(): void {
    this.savePreferences(DEFAULT_PREFERENCES);
  }

  private validatePreferences(prefs: any): UserPreferences {
    const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

    if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
      validated.theme = prefs.theme;
    }

    if (typeof prefs.notifications === 'boolean') {
      validated.notifications = prefs.notifications;
    }

    if (typeof prefs.language === 'string' && prefs.language.length === 2) {
      validated.language = prefs.language;
    }

    if (typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 24) {
      validated.fontSize = Math.round(prefs.fontSize);
    }

    return validated;
  }

  getCurrentTheme(): 'light' | 'dark' {
    const prefs = this.loadPreferences();
    
    if (prefs.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return prefs.theme;
  }
}

export { PreferencesManager, type UserPreferences };