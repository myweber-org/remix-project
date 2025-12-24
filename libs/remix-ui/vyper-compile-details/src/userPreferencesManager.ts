interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences: UserPreferences) {
    this.preferences = this.loadPreferences() || defaultPreferences;
  }

  private loadPreferences(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.validatePreferences();
    this.savePreferences();
  }

  private validatePreferences(): void {
    if (this.preferences.fontSize < 12 || this.preferences.fontSize > 24) {
      this.preferences.fontSize = 16;
    }

    const validLanguages = ['en', 'es', 'fr', 'de'];
    if (!validLanguages.includes(this.preferences.language)) {
      this.preferences.language = 'en';
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = { ...defaults };
    this.savePreferences();
  }
}

const defaultPrefs: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 16
};

export const userPrefsManager = new UserPreferencesManager(defaultPrefs);interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  itemsPerPage: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'light',
    language: 'en',
    notificationsEnabled: true,
    itemsPerPage: 10
  };

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (!stored) return { ...this.defaultPreferences };

    try {
      const parsed = JSON.parse(stored);
      return this.validateAndMerge(parsed);
    } catch {
      return { ...this.defaultPreferences };
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const merged = { ...current, ...updates };
    const validated = this.validateAndMerge(merged);
    
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(validated)
    );
    
    return validated;
  }

  resetToDefaults(): UserPreferences {
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
    return { ...this.defaultPreferences };
  }

  private validateAndMerge(data: unknown): UserPreferences {
    const result = { ...this.defaultPreferences };
    
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      
      if (obj.theme === 'light' || obj.theme === 'dark') {
        result.theme = obj.theme;
      }
      
      if (typeof obj.language === 'string') {
        result.language = obj.language;
      }
      
      if (typeof obj.notificationsEnabled === 'boolean') {
        result.notificationsEnabled = obj.notificationsEnabled;
      }
      
      if (typeof obj.itemsPerPage === 'number' && obj.itemsPerPage > 0) {
        result.itemsPerPage = Math.floor(obj.itemsPerPage);
      }
    }
    
    return result;
  }
}

export const userPreferences = new UserPreferencesManager();