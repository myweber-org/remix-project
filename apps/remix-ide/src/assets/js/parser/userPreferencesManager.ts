interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
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
    localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  resetToDefaults(): UserPreferences {
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
    return this.defaultPreferences;
  }

  validatePreferences(prefs: any): prefs is UserPreferences {
    return (
      prefs &&
      ['light', 'dark', 'auto'].includes(prefs.theme) &&
      typeof prefs.notifications === 'boolean' &&
      typeof prefs.language === 'string' &&
      typeof prefs.fontSize === 'number' &&
      prefs.fontSize >= 8 &&
      prefs.fontSize <= 32
    );
  }
}

export const userPrefsManager = new UserPreferencesManager();typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    fontSize: number;
    notificationsEnabled: boolean;
    language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    fontSize: 14,
    notificationsEnabled: true,
    language: 'en-US'
};

const STORAGE_KEY = 'app_user_preferences';

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
            console.warn('Failed to load preferences from localStorage:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        this.savePreferences();
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences to localStorage:', error);
        }
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
        return this.preferences[key];
    }
}

export const preferencesManager = new UserPreferencesManager();
```