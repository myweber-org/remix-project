interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 14
};

class UserPreferencesManager {
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
    if (!data || typeof data !== 'object') {
      return DEFAULT_PREFERENCES;
    }

    const prefs = data as Partial<UserPreferences>;

    return {
      theme: this.isValidTheme(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme,
      language: typeof prefs.language === 'string' ? prefs.language : DEFAULT_PREFERENCES.language,
      notificationsEnabled: typeof prefs.notificationsEnabled === 'boolean' 
        ? prefs.notificationsEnabled 
        : DEFAULT_PREFERENCES.notificationsEnabled,
      fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
        ? prefs.fontSize
        : DEFAULT_PREFERENCES.fontSize
    };
  }

  private isValidTheme(theme: unknown): theme is UserPreferences['theme'] {
    return theme === 'light' || theme === 'dark' || theme === 'auto';
  }

  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...updates
    };
    this.savePreferences();
  }

  private savePreferences(): void {
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export const userPreferencesManager = new UserPreferencesManager();typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    fontSize: number;
    notificationsEnabled: boolean;
    language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    fontSize: 16,
    notificationsEnabled: true,
    language: 'en-US'
};

const STORAGE_KEY = 'user_preferences_v1';

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return { ...DEFAULT_PREFERENCES, ...parsed };
            }
        } catch (error) {
            console.warn('Failed to load user preferences:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
        } catch (error) {
            console.warn('Failed to save user preferences:', error);
        }
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        this.savePreferences();
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    getTheme(): string {
        if (this.preferences.theme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return this.preferences.theme;
    }
}

export const preferencesManager = new UserPreferencesManager();
```