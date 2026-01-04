interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 16
  };

  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage', error);
    }
    return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
  }

  private validatePreferences(data: any): UserPreferences {
    const validThemes: Array<UserPreferences['theme']> = ['light', 'dark', 'auto'];
    
    return {
      theme: validThemes.includes(data.theme) ? data.theme : UserPreferencesManager.DEFAULT_PREFERENCES.theme,
      notifications: typeof data.notifications === 'boolean' ? data.notifications : UserPreferencesManager.DEFAULT_PREFERENCES.notifications,
      language: typeof data.language === 'string' && data.language.length === 2 ? data.language : UserPreferencesManager.DEFAULT_PREFERENCES.language,
      fontSize: typeof data.fontSize === 'number' && data.fontSize >= 12 && data.fontSize <= 24 ? data.fontSize : UserPreferencesManager.DEFAULT_PREFERENCES.fontSize
    };
  }

  public updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...this.validatePreferences(updates)
    };
    this.savePreferences();
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences to storage', error);
    }
  }

  public getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  public resetToDefaults(): void {
    this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  public isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export { UserPreferencesManager, type UserPreferences };interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'light',
    language: 'en',
    notificationsEnabled: true,
    fontSize: 14
  };

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return { ...this.defaultPreferences, ...JSON.parse(stored) };
      } catch {
        return this.defaultPreferences;
      }
    }
    return this.defaultPreferences;
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  resetToDefaults(): UserPreferences {
    localStorage.removeItem(this.STORAGE_KEY);
    return this.defaultPreferences;
  }

  hasStoredPreferences(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }
}

export { UserPreferencesManager };
export type { UserPreferences };